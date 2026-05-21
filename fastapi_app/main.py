import contextlib
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from arq import create_pool
import redis.asyncio as aioredis

from .config import redis_settings
from .i18n import I18nMiddleware
from .api import router as downloader_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Lifecycle hook mapping strictly ensuring Redis queue allocations fire efficiently on boot.
    logger.info("Allocating primary distribution bindings for ARQ Redis Queues...")
    app.state.arq_pool = await create_pool(redis_settings)
    
    # Initialize process-wide single global connection pool for the API endpoints to reuse
    app.state.redis_pool = aioredis.ConnectionPool(
        host=redis_settings.host,
        port=redis_settings.port,
        db=redis_settings.database,
        max_connections=50
    )
    yield
    # Shutdown unloads gracefully. 
    logger.info("Executing graceful cleanup of ARQ connection footprints...")
    await app.state.arq_pool.close()
    
    logger.info("Disconnecting global Redis connection pool...")
    await app.state.redis_pool.disconnect()

app = FastAPI(
    title="High-Traffic Media Downloader System",
    version="1.0.0",
    description="Asynchronous Task Dispatcher featuring ARQ queues and 14 native languages",
    lifespan=lifespan
)

# Standardized generic origin ruleset targeting typical separated infrastructure nodes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load JSON localization dynamically.
app.add_middleware(I18nMiddleware)

# Dispatch router allocations.
app.include_router(downloader_router)

@app.get("/health", tags=["Diagnostic"])
async def root_diagnostic():
    return {"status": "ok", "service": "fastapi-downloader-core"}
