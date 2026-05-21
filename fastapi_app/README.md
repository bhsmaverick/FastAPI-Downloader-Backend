# FastAPI Arq Social Media Downloader

High-traffic, asynchronous social media downloader built with FastAPI, Redis, ARQ background queues, and dynamic native 14-Language i18n localization.

## Architecture Features
- **Language Middleware**: `Accept-Language` or `?lang=` overrides mapping across 14 natively mapped languages loaded securely into memory states via isolated JSON.
- **ARQ Background Integration**: Offloads active HTTP blockings securely off into isolated queue workers decoupled from the main event loop context.
- **O(1) Memory Progress Statuses**: Progress states decoupled cleanly across Redis cache payloads permitting non-blocking asynchronous REST checking routines via `GET /api/status`.

## Setup
```bash
pip install -r requirements.txt

# Sub-Routine 1: Initialize Async Background Dispatch Workers
arq fastapi_app.worker.WorkerSettings

# Sub-Routine 2: Power Up FastAPI Core Networking Endpoints
uvicorn fastapi_app.main:app --port 8000 --reload
```
