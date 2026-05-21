import os
import asyncio
import json
import logging
import time
import shutil
import redis.asyncio as aioredis
from arq import worker, cron

from .config import redis_settings
from .processor import MediaProcessor, MediaProcessorError

logger = logging.getLogger(__name__)

async def update_job_progress(job_id: str, status: str, progress: float, message: str, result_url: str = None):
    """
    Sub-routine executing independent state injections actively to Redis backend cache boundaries, 
    permitting non-blocking client-polling queries.
    """
    redis_client = aioredis.Redis(host=redis_settings.host, port=redis_settings.port, db=redis_settings.database)
    payload = {
        "status": status,
        "progress": progress,
        "message": message,
        "result_url": result_url
    }
    await redis_client.set(f"task_progress:{job_id}", json.dumps(payload), ex=86400)
    await redis_client.close()



async def download_media_task(ctx, url: str, output_format: str, options: dict):
    """
    ARQ Execution Environment Worker Routine
    Dispatched completely independently mapped through persistent Redis connection queues.
    """
    job_id = ctx['job_id']
    logger.info(f"Arq worker launched | ID: {job_id} | Target URL: {url} | Requested Target Format: {output_format}")

    # Create distinct scratch dir to protect operational workspace parallelism
    temp_dir = os.path.abspath(f"./downloads/{job_id}")
    os.makedirs(temp_dir, exist_ok=True)
    
    processor = MediaProcessor()

    try:
        # Step 1: Active Validation & Resource Allocation
        await update_job_progress(job_id, "processing", 10.0, "processing")
        
        # Meta extraction
        meta_title = options.get("title")
        meta_artist = options.get("artist")
        crop_vertical = options.get("crop_vertical", False)

        # Step 2: Main Stream Extraction & Download
        await update_job_progress(job_id, "downloading", 30.0, "downloading")
        
        downloaded_file = await processor.download(
            url=url,
            output_dir=temp_dir,
            format_type=output_format,
            options=options.get("ydl_opts")
        )
        logger.info(f"Yt-dlp extracted media successfully: {downloaded_file}")

        current_file = downloaded_file

        # Step 3: Vertical Cropping (only applicable if video files are extracted)
        if crop_vertical and output_format.lower() != "mp3":
            await update_job_progress(job_id, "processing", 60.0, "processing")
            cropped_file = os.path.join(temp_dir, f"cropped_{os.path.basename(current_file)}")
            current_file = await processor.crop_to_vertical(current_file, cropped_file)
            logger.info(f"Successfully auto-cropped portrait layout video: {current_file}")

        # Step 4: Metadata Tagging Injection
        if meta_title or meta_artist:
            await update_job_progress(job_id, "finalizing", 80.0, "finalizing")
            tagged_file = os.path.join(temp_dir, f"tagged_{os.path.basename(current_file)}")
            current_file = await processor.inject_metadata(
                input_path=current_file,
                output_path=tagged_file,
                title=meta_title or "Downloader Asset",
                artist=meta_artist or "MediaDownloader"
            )
            logger.info(f"Lossless FFmpeg tagging executed successfully: {current_file}")

        # Step 5: Final Serving Storage Asset Layout Mapping via X-Accel-Redirect
        final_url = f"/api/downloads/{job_id}/{os.path.basename(current_file)}"
        await update_job_progress(job_id, "completed", 100.0, "completed", result_url=final_url)
        logger.info(f"Task gracefully concluded | ID: {job_id} | Optimized Serve Link: {final_url}")

        return final_url
    
    except MediaProcessorError as mpe:
        logger.error(f"Media extraction runtime failed: {str(mpe)}")
        await update_job_progress(job_id, "failed", 0.0, "error_processing")
        raise
    except Exception as e:
        logger.error(f"Catastrophic halt encountered within task bounds {job_id}: {str(e)}")
        await update_job_progress(job_id, "failed", 0.0, "error_processing")
        raise


async def cleanup_expired_downloads_task(ctx):
    """
    Lightweight background cleanup cron job.
    Runs every 10 minutes to scan the local downloads volume storage and purge any files/directories
    older than 30 minutes to save operational space footprint.
    """
    logger.info("Initializing background file purge task...")
    downloads_root = os.path.abspath("./downloads")
    if not os.path.exists(downloads_root):
        logger.info("Downloads directory empty or not found. Skipping.")
        return

    now = time.time()
    cutoff_seconds = 30 * 60  # 30 minutes
    purged_count = 0

    for item in os.listdir(downloads_root):
        item_path = os.path.join(downloads_root, item)
        if os.path.isdir(item_path):
            # Check modification time of directory
            mtime = os.path.getmtime(item_path)
            age = now - mtime
            if age > cutoff_seconds:
                try:
                    shutil.rmtree(item_path)
                    purged_count += 1
                    logger.info(f"Purged expired download directory: {item_path} (Age: {age/60:.2f} mins)")
                except Exception as ex:
                    logger.error(f"Failed to purge folder {item_path}: {str(ex)}")

    logger.info(f"Cleanup run completed. Purged {purged_count} expired job directories.")


# Core execution bindings hooked into Arq settings mapping
class WorkerSettings:
    functions = [download_media_task]
    cron_jobs = [
        cron(cleanup_expired_downloads_task, second=0, minute={0, 10, 20, 30, 40, 50})
    ]
    redis_settings = redis_settings
    max_jobs = 15
    handle_signals = False # Excluded locally to prevent premature signal term handlers internally

