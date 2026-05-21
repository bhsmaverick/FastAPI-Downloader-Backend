from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, Dict, Any

class DownloadRequest(BaseModel):
    url: HttpUrl = Field(..., description="The URL of the social media content to download")
    format: str = Field(default="mp4", description="Requested output format (e.g., mp4, mp3)")
    options: Optional[Dict[str, Any]] = Field(default=None, description="Additional options for the backend orchestrator")

class DownloadTaskResponse(BaseModel):
    task_id: str
    message: str

class StatusResponse(BaseModel):
    task_id: str
    status: str
    progress: float = Field(..., ge=0.0, le=100.0)
    message: str
    result_url: Optional[str] = None
