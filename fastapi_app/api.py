from fastapi import APIRouter, Request, HTTPException, Path, Response
import redis.asyncio as aioredis
import json
import os
import mimetypes

from .schemas import DownloadRequest, DownloadTaskResponse, StatusResponse
from .config import redis_settings

router = APIRouter(prefix="/api", tags=["Downloader"])

@router.post("/download", response_model=DownloadTaskResponse)
async def create_download_task(request: Request, payload: DownloadRequest):
    t = request.state.t
    pool = request.app.state.arq_pool

    # Dispatch blocking processing operation entirely off to ARQ background worker threads
    job = await pool.enqueue_job(
        'download_media_task',
        url=str(payload.url),
        output_format=payload.format,
        options=payload.options or {}
    )

    if not job:
        raise HTTPException(status_code=500, detail=t("error_enqueuing"))

    # Initialize progress tracking actively via Redis cache boundaries
    redis_client = aioredis.Redis(connection_pool=request.app.state.redis_pool)
    initial_state = {
        "status": "queued",
        "progress": 0.0,
        "message": "queued",
        "result_url": None
    }
    await redis_client.set(
        f"task_progress:{job.job_id}",
        json.dumps(initial_state),
        ex=86400  # 1 day persistent tracking expiration window
    )

    return DownloadTaskResponse(task_id=job.job_id, message=t("task_started"))


@router.get("/status/{task_id}", response_model=StatusResponse)
async def get_download_status(request: Request, task_id: str = Path(..., description="Tracking ID returned on successful download request")):
    t = request.state.t
    redis_client = aioredis.Redis(connection_pool=request.app.state.redis_pool)

    raw_data = await redis_client.get(f"task_progress:{task_id}")

    if not raw_data:
        raise HTTPException(status_code=404, detail=t("task_not_found"))

    data = json.loads(raw_data)
    
    # Isolate internal standard status phrases and translate via dynamically injected i18n layer on flight
    message_key = data.get("message", "status_msg")

    return StatusResponse(
        task_id=task_id,
        status=data.get("status", "unknown"),
        progress=data.get("progress", 0.0),
        message=t(message_key),
        result_url=data.get("result_url")
    )


@router.get("/downloads/{task_id}/{filename}")
async def serve_file_nginx(request: Request, task_id: str = Path(...), filename: str = Path(...)):
    """
    Optimized endpoint where clients retrieve the completed, processed assets.
    Instead of streaming standard files in resource-heavy Python processes, this immediately
    injects Nginx's 'X-Accel-Redirect' header instructing Nginx's upstream components to carry out 
    static file byte streaming directly.
    """
    t = request.state.t
    downloads_root = os.path.abspath("./downloads")
    file_path = os.path.join(downloads_root, task_id, filename)

    # Secure resolved path to prevent path traversal vulnerability (Directory Traversal Bypass block)
    resolved_path = os.path.abspath(file_path)
    if not resolved_path.startswith(downloads_root):
        raise HTTPException(status_code=403, detail="Access denied")

    if not os.path.exists(resolved_path) or not os.path.isfile(resolved_path):
        raise HTTPException(status_code=404, detail=t("task_not_found"))

    # Determine standard Content-Type and format headers securely
    content_type, _ = mimetypes.guess_type(resolved_path)
    if not content_type:
        content_type = "application/octet-stream"

    # Map the local file path to the virtual Nginx internal location "/internal_downloads/"
    # For example, local /app/downloads/job_abc/video.mp4 maps to Nginx location /internal_downloads/job_abc/video.mp4
    nginx_internal_path = f"/internal_downloads/{task_id}/{filename}"

    headers = {
        "X-Accel-Redirect": nginx_internal_path,
        "Content-Type": content_type,
        "Content-Disposition": f'attachment; filename="{filename}"'
    }

    return Response(content=None, headers=headers)
