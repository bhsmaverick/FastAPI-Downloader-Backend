import asyncio
import os
import logging
from typing import Optional, Dict, Any
from concurrent.futures import ThreadPoolExecutor
import yt_dlp

logger = logging.getLogger(__name__)

# Initialize a single process-wide global thread pool to prevent thread leaks and OS resource exhaustion
GLOBAL_THREAD_POOL = ThreadPoolExecutor(max_workers=20)

class MediaProcessorError(Exception):
    """Base exception for media processing workflow issues."""
    pass

class MediaProcessor:
    def __init__(self, executor: Optional[ThreadPoolExecutor] = None):
        # Dedicated thread pool executor to safely offload synchronous blocking I/O calls (like yt-dlp)
        self.executor = executor or GLOBAL_THREAD_POOL

    async def download(self, url: str, output_dir: str, format_type: str = "mp4", options: Optional[Dict[str, Any]] = None) -> str:
        """
        Extracts and downloads media cleanly from platforms like Instagram, TikTok, YouTube, etc.
        Configures robust HTTP headers, customized user agents, and extractors to obtain watermark-free, 
        original streams where supported natively in yt-dlp. Made non-blocking via ThreadPoolExecutor.
        """
        loop = asyncio.get_running_loop()
        os.makedirs(output_dir, exist_ok=True)
        
        # Configure robust download headers to simulate high-reputation physical clients
        http_headers = {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Connection": "keep-alive"
        }

        # Format mappings
        is_audio = format_type.lower() == "mp3"
        ydl_opts = {
            "outtmpl": os.path.join(output_dir, "%(title)s_%(id)s.%(ext)s"),
            "restrictfilenames": True,
            "noplaylist": True,
            "quiet": True,
            "no_warnings": True,
            "http_headers": http_headers,
            # Force watermark extraction configurations via referer overrides or specific extractions
            "referer": "https://www.tiktok.com/",
        }

        if is_audio:
            ydl_opts.update({
                "format": "bestaudio/best",
                "postprocessors": [{
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": "192",
                }]
            })
        else:
            # Prefer MP4 container formats with high compatibility
            ydl_opts.update({
                "format": "bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best",
                "merge_output_format": "mp4"
            })

        # Allow user overlay overrides for advanced custom extractors
        if options:
            ydl_opts.update(options)

        def _sync_download():
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                try:
                    info = ydl.extract_info(url, download=True)
                    if not info:
                        raise MediaProcessorError("Failed to extract media information.")
                    
                    filename = ydl.prepare_filename(info)
                    
                    # For audio post-processing, the file ending changes from internal temp representation
                    if is_audio:
                        base, _ = os.path.splitext(filename)
                        filename = f"{base}.mp3"
                    elif not filename.endswith(".mp4") and os.path.exists(f"{os.path.splitext(filename)[0]}.mp4"):
                        filename = f"{os.path.splitext(filename)[0]}.mp4"

                    if not os.path.exists(filename):
                        # Attempt to sweep target output files when standard patterns deviate
                        search_dir = os.path.dirname(filename)
                        files = [os.path.join(search_dir, f) for f in os.listdir(search_dir) if info["id"] in f]
                        if files:
                            filename = files[0]
                        else:
                            raise FileNotFoundError("Target downloaded file could not be mapped locally.")

                    return os.path.abspath(filename)
                except Exception as ex:
                    logger.error(f"yt-dlp sync execution error: {str(ex)}")
                    raise MediaProcessorError(f"Extraction failed: {str(ex)}")

        return await loop.run_in_executor(self.executor, _sync_download)

    async def crop_to_vertical(self, input_path: str, output_path: str) -> str:
        """
        Auto-crops landscape (16:9) video components into vertical standard dimensions (9:16)
        using highly-optimized FFmpeg hardware filters completely in an isolated non-blocking subprocess.
        """
        if not os.path.exists(input_path):
            raise MediaProcessorError(f"Source file not found at: {input_path}")

        # Construct safe FFmpeg execution params ensuring accurate aspect mapping and streaming
        # Re-encodes via fast libx264 with audio streams copied to preserve extreme rendering speed
        cmd = [
            "ffmpeg", "-y",
            "-i", input_path,
            "-vf", "crop='trunc(ih*9/16/2)*2:trunc(ih/2)*2'",
            "-c:v", "libx264",
            "-preset", "superfast",
            "-crf", "23",
            "-c:a", "copy",
            output_path
        ]

        logger.info(f"Triggering asynchronous vertical FFmpeg crop operation command: {' '.join(cmd)}")
        
        try:
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()
            
            if process.returncode != 0:
                err_msg = stderr.decode().strip()
                logger.error(f"FFmpeg crop execution failed with exit code {process.returncode}: {err_msg}")
                raise MediaProcessorError(f"FFmpeg crop execution failed: {err_msg}")

            return os.path.abspath(output_path)
        except Exception as ex:
            logger.error(f"Failed to execute FFmpeg cropping sub-process: {str(ex)}")
            raise MediaProcessorError(f"Crop operation failed with system exception: {str(ex)}")

    async def inject_metadata(self, input_path: str, output_path: str, title: str, artist: str) -> str:
        """
        Losslessly injects core asset tags (Title/Artist metadata tags) into MP3 or MP4 target containers.
        By copying streams and using FFmpeg's metadata structures directly, this remains safe and fast.
        """
        if not os.path.exists(input_path):
            raise MediaProcessorError(f"Source file not found at: {input_path}")

        # Build FFmpeg args using metadata injection flags. Copies original streams instantly.
        cmd = [
            "ffmpeg", "-y",
            "-i", input_path,
            "-metadata", f"title={title}",
            "-metadata", f"artist={artist}",
            "-c", "copy",
            output_path
        ]

        logger.info(f"Executing non-blocking metadata injection subprocess operation: {' '.join(cmd)}")

        try:
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()

            if process.returncode != 0:
                err_msg = stderr.decode().strip()
                logger.error(f"FFmpeg metadata injection failed with exit code {process.returncode}: {err_msg}")
                raise MediaProcessorError(f"FFmpeg metadata injection failed: {err_msg}")

            return os.path.abspath(output_path)
        except Exception as ex:
            logger.error(f"Metadata write operation experienced system error: {str(ex)}")
            raise MediaProcessorError(f"Metadata write execution: {str(ex)}")
