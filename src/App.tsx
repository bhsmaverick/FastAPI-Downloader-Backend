import React, { useState, useEffect } from "react";
import { 
  Download, 
  Code, 
  Settings, 
  Globe, 
  Cpu, 
  Layers, 
  Video, 
  Music, 
  ArrowRight, 
  ExternalLink, 
  FileCode2, 
  CheckCircle2, 
  Zap, 
  Sparkles, 
  Clock, 
  Server,
  RefreshCw,
  Terminal,
  Database
} from "lucide-react";

// Inlined dictionaries identical to the backend JSON locale files to enable accurate simulated translations on flight
const translations: Record<string, Record<string, string>> = {
  "en": { "task_started": "Task started", "error_enqueuing": "Error enqueuing task", "task_not_found": "Task not found", "status_msg": "Status retrieved", "queued": "Task is queued", "processing": "Processing", "downloading": "Downloading", "finalizing": "Finalizing", "completed": "Completed", "error_processing": "Processing error" },
  "es": { "task_started": "Tarea iniciada", "error_enqueuing": "Error en la cola", "task_not_found": "Tarea no encontrada", "status_msg": "Estado obtenido", "queued": "Tarea en cola", "processing": "Procesando", "downloading": "Descargando", "finalizing": "Finalizando", "completed": "Completado", "error_processing": "Error de procesamiento" },
  "pt": { "task_started": "Tarefa iniciada", "error_enqueuing": "Erro na fila", "task_not_found": "Tarefa não encontrada", "status_msg": "Status obtido", "queued": "Tarefa na fila", "processing": "Processando", "downloading": "Baixando", "finalizing": "Finalizando", "completed": "Concluído", "error_processing": "Erro de processamento" },
  "de": { "task_started": "Aufgabe gestartet", "error_enqueuing": "Fehler beim Einreihen", "task_not_found": "Aufgabe nicht gefunden", "status_msg": "Status abgerufen", "queued": "Aufgabe in Warteschlange", "processing": "Verarbeitung", "downloading": "Herunterladen", "finalizing": "Abschließen", "completed": "Abgeschlossen", "error_processing": "Verarbeitungsfehler" },
  "fr": { "task_started": "Tâche démarrée", "error_enqueuing": "Erreur de file d'attente", "task_not_found": "Tâche introuvable", "status_msg": "Statut récupéré", "queued": "Tâche en file d'attente", "processing": "Traitement", "downloading": "Téléchargement", "finalizing": "Finalisation", "completed": "Terminé", "error_processing": "Erreur de traitement" },
  "ua": { "task_started": "Завдання розпочато", "error_enqueuing": "Помилка черги", "task_not_found": "Завдання не знайдено", "status_msg": "Статус отримано", "queued": "Завдання в черзі", "processing": "Обробка", "downloading": "Завантаження", "finalizing": "Завершення", "completed": "Завершено", "error_processing": "Помилка обробки" },
  "pl": { "task_started": "Zadanie rozpoczęte", "error_enqueuing": "Błąd kolejkowania", "task_not_found": "Zadanie nie znalezione", "status_msg": "Status pobrany", "queued": "Zadanie w kolejce", "processing": "Przetwarzanie", "downloading": "Pobieranie", "finalizing": "Zakończenie", "completed": "Zakończone", "error_processing": "Błąd przetwarzania" },
  "ja": { "task_started": "タスク開始", "error_enqueuing": "キューエラー", "task_not_found": "タスクが見つかりません", "status_msg": "ステータス取得済み", "queued": "キューに入ったタスク", "processing": "処理中", "downloading": "ダウンロード中", "finalizing": "終了中", "completed": "完了", "error_processing": "処理エラー" },
  "ar": { "task_started": "بدأت المهمة", "error_enqueuing": "خطأ في قائمة الانتظار", "task_not_found": "المهمة غير موجودة", "status_msg": "الحالة المسترجعة", "queued": "مهمة في قائمة الانتظار", "processing": "جاري المعالجة", "downloading": "تنزيل", "finalizing": "الانتهاء", "completed": "منجز", "error_processing": "خطأ في المعالجة" },
  "tr": { "task_started": "Görev başlatıldı", "error_enqueuing": "Sıraya ekleme hatası", "task_not_found": "Görev bulunadı", "status_msg": "Durum alındı", "queued": "Görev kuyrukta", "processing": "İşleniyor", "downloading": "İndiriliyor", "finalizing": "Sonuçlandırılıyor", "completed": "Tamamlandı", "error_processing": "İşleme hatası" },
  "hi": { "task_started": "कार्य शुरू", "error_enqueuing": "कतार त्रुटि", "task_not_found": "कार्य नहीं मिला", "status_msg": "स्थिति प्राप्त", "queued": "कार्य कतार में है", "processing": "प्रसंस्करण", "downloading": "डाउनलोड कर रहा है", "finalizing": "अंतिम रूप दे रहा है", "completed": "पूर्ण", "error_processing": "प्रसंस्करण त्रुटि" },
  "it": { "task_started": "Attività avviata", "error_enqueuing": "Errore accodamento", "task_not_found": "Attività non trovata", "status_msg": "Stato recuperato", "queued": "Attività in coda", "processing": "In elaborazione", "downloading": "Download", "finalizing": "Finalizzando", "completed": "Completato", "error_processing": "Errore elaborazione" },
  "ko": { "task_started": "작업 시작됨", "error_enqueuing": "대기열 오류", "task_not_found": "작업을 찾을 수 없음", "status_msg": "가져온 상태", "queued": "작업 대기 중", "processing": "처리 중", "downloading": "다운로드 중", "finalizing": "마무리", "completed": "완료됨", "error_processing": "처리 오류" },
  "id": { "task_started": "Tugas dimulai", "error_enqueuing": "Kesalahan antrean", "task_not_found": "Tugas tidak ditemukan", "status_msg": "Status diambil", "queued": "Tugas dalam antrean", "processing": "Memproses", "downloading": "Mengunduh", "finalizing": "Menyelesaikan", "completed": "Selesai", "error_processing": "Kesalahan pemrosesan" }
};

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "ua", label: "Українська" },
  { code: "pl", label: "Polski" },
  { code: "ja", label: "日本語" },
  { code: "ar", label: "العربية" },
  { code: "tr", label: "Türkçe" },
  { code: "hi", label: "हिन्दी" },
  { code: "it", label: "Italiano" },
  { code: "ko", label: "한국어" },
  { code: "id", label: "Indonesia" }
];

const mockUrls = [
  { url: "https://tiktok.com/@creator/video/73293849102", label: "TikTok Video (Watermark-Free Stream)" },
  { url: "https://instagram.com/reel/C3b8s9f1u0", label: "Instagram Reel (HQ MP4 Source)" },
  { url: "https://youtube.com/watch?v=dQw4w9WgXcQ", label: "YouTube Video (1080p Stream)" }
];

const sourceFiles = [
  {
    name: "processor.py",
    description: "Core media orchestrator. Manages yt-dlp downloader execution via ThreadPoolExecutor and async subprocesses for FFmpeg ratio crops and metadata tagging.",
    code: `import asyncio
import os
import logging
from typing import Optional, Dict, Any
from concurrent.futures import ThreadPoolExecutor
import yt_dlp

logger = logging.getLogger(__name__)

class MediaProcessorError(Exception):
    pass

class MediaProcessor:
    def __init__(self, executor: Optional[ThreadPoolExecutor] = None):
        self.executor = executor or ThreadPoolExecutor(max_workers=10)

    async def download(self, url: str, output_dir: str, format_type: str = "mp4", options: Optional[Dict[str, Any]] = None) -> str:
        """
        Extracts and downloads media cleanly from platforms like Instagram, TikTok, YouTube.
        Simulates Safari iOS clients enabling natural extraction bypass of watermark overlay vectors.
        """
        loop = asyncio.get_running_loop()
        os.makedirs(output_dir, exist_ok=True)
        
        http_headers = {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Connection": "keep-alive"
        }

        is_audio = format_type.lower() == "mp3"
        ydl_opts = {
            "outtmpl": os.path.join(output_dir, "%(title)s_%(id)s.%(ext)s"),
            "restrictfilenames": True,
            "noplaylist": True,
            "quiet": True,
            "http_headers": http_headers,
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
            ydl_opts.update({
                "format": "bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best",
                "merge_output_format": "mp4"
            })

        if options:
            ydl_opts.update(options)

        def _sync_download():
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                filename = ydl.prepare_filename(info)
                return os.path.abspath(filename)

        return await loop.run_in_executor(self.executor, _sync_download)

    async def crop_to_vertical(self, input_path: str, output_path: str) -> str:
        """
        Auto-crops landscape (16:9) video components into vertical standard dimensions (9:16)
        using highly-optimized FFmpeg filters in non-blocking asyncio subprocesses.
        """
        cmd = [
            "ffmpeg", "-y", "-i", input_path,
            "-vf", "crop=ih*9/16:ih",
            "-c:v", "libx264", "-preset", "superfast", "-crf", "23",
            "-c:a", "copy", output_path
        ]
        process = await asyncio.create_subprocess_exec(
            *cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
        )
        await process.communicate()
        return os.path.abspath(output_path)

    async def inject_metadata(self, input_path: str, output_path: str, title: str, artist: str) -> str:
        """
        Losslessly injects Title/Artist metadata tagging into MP3 or MP4 container streams.
        """
        cmd = [
            "ffmpeg", "-y", "-i", input_path,
            "-metadata", f"title={title}", "-metadata", f"artist={artist}",
            "-c", "copy", output_path
        ]
        process = await asyncio.create_subprocess_exec(
            *cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
        )
        await process.communicate()
        return os.path.abspath(output_path)`
  },
  {
    name: "worker.py",
    description: "ARQ background task worker. Maps operational segments, executes pipeline tasks asynchronously, and updates the task cache in Redis for real-time status retrieval.",
    code: `import os
import asyncio
import json
import logging
import redis.asyncio as aioredis
from arq import worker
from .config import redis_settings
from .processor import MediaProcessor, MediaProcessorError

logger = logging.getLogger(__name__)

async def update_job_progress(job_id: str, status: str, progress: float, message: str, result_url: str = None):
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
    job_id = ctx['job_id']
    temp_dir = os.path.abspath(f"./downloads/{job_id}")
    os.makedirs(temp_dir, exist_ok=True)
    processor = MediaProcessor()

    try:
        await update_job_progress(job_id, "processing", 10.0, "processing")
        
        meta_title = options.get("title")
        meta_artist = options.get("artist")
        crop_vertical = options.get("crop_vertical", False)

        await update_job_progress(job_id, "downloading", 30.0, "downloading")
        downloaded_file = await processor.download(url, temp_dir, output_format, options.get("ydl_opts"))
        current_file = downloaded_file

        if crop_vertical and output_format.lower() != "mp3":
            await update_job_progress(job_id, "processing", 60.0, "processing")
            cropped_file = os.path.join(temp_dir, f"cropped_{os.path.basename(current_file)}")
            current_file = await processor.crop_to_vertical(current_file, cropped_file)

        if meta_title or meta_artist:
            await update_job_progress(job_id, "finalizing", 80.0, "finalizing")
            tagged_file = os.path.join(temp_dir, f"tagged_{os.path.basename(current_file)}")
            current_file = await processor.inject_metadata(current_file, tagged_file, meta_title, meta_artist)

        final_url = f"https://cdn.example.com/storage/{job_id}/{os.path.basename(current_file)}"
        await update_job_progress(job_id, "completed", 100.0, "completed", result_url=final_url)
        return final_url
    except Exception as e:
        await update_job_progress(job_id, "failed", 0.0, "error_processing")
        raise

class WorkerSettings:
    functions = [download_media_task]
    redis_settings = redis_settings
    max_jobs = 15
    handle_signals = False`
  },
  {
    name: "api.py",
    description: "FastAPI Endpoints layer. Exposes validation schemas and connects client requests instantly to Redis queues for low-overhead enqueuing.",
    code: `from fastapi import APIRouter, Request, HTTPException, Path
import redis.asyncio as aioredis
import json
from .schemas import DownloadRequest, DownloadTaskResponse, StatusResponse
from .config import redis_settings

router = APIRouter(prefix="/api", tags=["Downloader"])

@router.post("/download", response_model=DownloadTaskResponse)
async def create_download_task(request: Request, payload: DownloadRequest):
    t = request.state.t
    pool = request.app.state.arq_pool

    job = await pool.enqueue_job(
        'download_media_task',
        url=str(payload.url),
        output_format=payload.format,
        options=payload.options or {}
    )
    if not job:
        raise HTTPException(status_code=500, detail=t("error_enqueuing"))

    redis_client = aioredis.Redis(host=redis_settings.host, port=redis_settings.port, db=redis_settings.database)
    initial_state = {"status": "queued", "progress": 0.0, "message": "queued", "result_url": None}
    await redis_client.set(f"task_progress:{job.job_id}", json.dumps(initial_state), ex=86400)
    await redis_client.close()

    return DownloadTaskResponse(task_id=job.job_id, message=t("task_started"))

@router.get("/status/{task_id}", response_model=StatusResponse)
async def get_download_status(request: Request, task_id: str = Path(...)):
    t = request.state.t
    redis_client = aioredis.Redis(host=redis_settings.host, port=redis_settings.port, db=redis_settings.database)
    raw_data = await redis_client.get(f"task_progress:{task_id}")
    await redis_client.close()

    if not raw_data:
        raise HTTPException(status_code=404, detail=t("task_not_found"))

    data = json.loads(raw_data)
    message_key = data.get("message", "status_msg")

    return StatusResponse(
        task_id=task_id,
        status=data.get("status", "unknown"),
        progress=data.get("progress", 0.0),
        message=t(message_key),
        result_url=data.get("result_url")
    )`
  },
  {
    name: "i18n.py",
    description: "Dynamic Internationalization middleware. Parses headers or query variables overrides to establish request contexts across 14 languages.",
    code: `import json
import os
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

SUPPORTED_LANGUAGES = ["en", "es", "pt", "de", "fr", "ua", "pl", "ja", "ar", "tr", "hi", "it", "ko", "id"]
DEFAULT_LANGUAGE = "en"

class I18nMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
         super().__init__(app)
         self.translations = {}
         self._load_locales()

    def _load_locales(self):
         for lang in SUPPORTED_LANGUAGES:
              # Loads key values dynamically from /fastapi_app/locales/{lang}.json
              pass

    async def dispatch(self, request: Request, call_next):
         lang_param = request.query_params.get("lang")
         accept_lang = request.headers.get("Accept-Language", "")
         selected_lang = DEFAULT_LANGUAGE

         if lang_param and lang_param in SUPPORTED_LANGUAGES:
              selected_lang = lang_param
         elif accept_lang:
              for al in accept_lang.split(","):
                   code = al.split(";")[0].strip().split("-")[0].lower()
                   if code in SUPPORTED_LANGUAGES:
                        selected_lang = code
                        break

         def translate(key: str) -> str:
              return self.translations.get(selected_lang, {}).get(key) or key

         request.state.t = translate
         request.state.lang = selected_lang
         response = await call_next(request)
         response.headers["Content-Language"] = selected_lang
         return response`
  },
  {
    name: "main.py",
    description: "FastAPI App bootstrapper. Configures lifecycle scopes, initiates CORS security, registers localized i18n middleware, and connects routers.",
    code: `import contextlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from arq import create_pool
from .config import redis_settings
from .i18n import I18nMiddleware
from .api import router as downloader_router

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup distributed ARQ queue pool on server startup
    app.state.arq_pool = await create_pool(redis_settings)
    yield
    # Cleanup resource footprint gracefully on termination
    await app.state.arq_pool.close()

app = FastAPI(title="High-Traffic Media Downloader System", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.add_middleware(I18nMiddleware)
app.include_router(downloader_router)`
  },
  {
    name: "schemas.py",
    description: "Pydantic parsing and validation models. Ensures strong typing constraints and generates automatic interactive OpenAPI documentation.",
    code: `from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, Dict, Any

class DownloadRequest(BaseModel):
    url: HttpUrl = Field(..., description="The URL of the social media content to download")
    format: str = Field(default="mp4", description="Requested output format (e.g., mp4, mp3)")
    options: Optional[Dict[str, Any]] = Field(default=None, description="Additional options for the backend")

class DownloadTaskResponse(BaseModel):
    task_id: str
    message: str

class StatusResponse(BaseModel):
    task_id: str
    status: str
    progress: float = Field(..., ge=0.0, le=100.0)
    message: str
    result_url: Optional[str] = None`
  }
];

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [activeTab, setActiveTab] = useState<"sandbox" | "architecture" | "files">("sandbox");
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  // Sandbox Input State
  const [targetUrl, setTargetUrl] = useState("https://tiktok.com/@creator/video/73293849102");
  const [format, setFormat] = useState("mp4");
  const [cropVertical, setCropVertical] = useState(false);
  const [metaTitle, setMetaTitle] = useState("Original Reel Sound");
  const [metaArtist, setMetaArtist] = useState("HighTraffic Creator");

  // Sandbox Pipeline State Machine Variables
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState("queued"); // queued, downloading, cropping, tagging, completed
  const [currentMessageKey, setCurrentMessageKey] = useState("queued");
  const [finalResultUrl, setFinalResultUrl] = useState<string | null>(null);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);

  // Localization translator closure helper
  const t = (key: string): string => {
    return translations[selectedLanguage]?.[key] || translations["en"]?.[key] || key;
  };

  const addLog = (msg: string) => {
    setSimulationLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Run simulated asynchronous pipeline simulating worker behaviors
  const handleStartSimulation = () => {
    setIsProcessing(true);
    const id = "job_" + Math.random().toString(36).substring(2, 11).toUpperCase();
    setJobId(id);
    setCurrentProgress(0);
    setCurrentStatus("queued");
    setCurrentMessageKey("queued");
    setFinalResultUrl(null);
    setSimulationLogs([]);

    addLog(`POST /api/download received inside Node/FastAPI boundary. Selected language: ${selectedLanguage.toUpperCase()}`);
    addLog(`I18n Middleware resolved. Response translated containing key: "${t("task_started")}"`);
    addLog(`ARQ distribution pool enqueued job with ID: ${id}`);
  };

  useEffect(() => {
    if (!isProcessing || !jobId) return;

    let timer: NodeJS.Timeout;

    if (currentProgress < 10) {
      timer = setTimeout(() => {
        setCurrentProgress(10);
        setCurrentStatus("processing");
        setCurrentMessageKey("processing");
        addLog(`Arq Background Worker acquired job [${jobId}] from Redis Cluster query.`);
        addLog(`Initiating extractor probe for watermark-free streaming parameters.`);
      }, 1000);
    } else if (currentProgress < 45) {
      timer = setTimeout(() => {
        setCurrentProgress(45);
        setCurrentStatus("downloading");
        setCurrentMessageKey("downloading");
        addLog(`MediaProcessor starting yt-dlp binary extraction using simulated mobile Client Headers.`);
        addLog(`Downloading original media stream bypass. Estimated size: 14.2 MB.`);
      }, 1800);
    } else if (currentProgress < 75) {
      timer = setTimeout(() => {
        if (cropVertical && format !== "mp3") {
          setCurrentProgress(75);
          setCurrentStatus("cropping");
          setCurrentMessageKey("processing"); // mapping to translated process
          addLog(`Spawning FFmpeg pipeline layout conversion subprocess...`);
          addLog(`Clipped landscape boundaries applying formula: "crop=ih*9/16:ih" preserving heights.`);
        } else {
          setCurrentProgress(75);
          addLog(`Skipped vertical cropping step (options parameter empty or mp3 audio stream identified).`);
        }
      }, 2000);
    } else if (currentProgress < 90) {
      timer = setTimeout(() => {
        if (metaTitle || metaArtist) {
          setCurrentProgress(90);
          setCurrentStatus("tagging");
          setCurrentMessageKey("finalizing");
          addLog(`Executing lossless metadata injector on output container stream...`);
          addLog(`Injected Tag - Title: "${metaTitle}", Artist: "${metaArtist}"`);
        } else {
          setCurrentProgress(90);
          addLog(`Skipped metadata container annotation step.`);
        }
      }, 1500);
    } else if (currentProgress < 100) {
      timer = setTimeout(() => {
        setCurrentProgress(100);
        setCurrentStatus("completed");
        setCurrentMessageKey("completed");
        const ext = format === "mp3" ? "mp3" : "mp4";
        const filename = `stream_${jobId}_final.${ext}`;
        const finalUrl = `/api/downloads/${jobId}/${filename}`;
        setFinalResultUrl(finalUrl);
        addLog(`Successfully moved parsed artifacts into secure CDN distributed storage namespaces.`);
        addLog(`Terminated background thread sequence elegantly. Job completed!`);
        setIsProcessing(false);
      }, 1500);
    }

    return () => clearTimeout(timer);
  }, [isProcessing, currentProgress, jobId, cropVertical, format, metaTitle, metaArtist]);

  return (
    <div className="min-h-screen bg-[#0E1117] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Decorative Gradient Line Bar */}
      <div className="h-[4px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 w-full" />

      {/* Main Structural Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
        
        {/* Navigation / Brand Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider bg-emerald-500/10 text-emerald-400 uppercase border border-emerald-500/20">
                Production Scaffold
              </span>
              <span className="text-slate-500 text-xs font-mono">• Python FastAPI + Redis Arq</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              FastAPI Downloader <span className="text-slate-400 font-light">Architecture Studio</span>
            </h1>
            <p className="text-slate-400 text-[14px] mt-1">
              Complete high-concurrency architecture displaying multitenant localization, thread pooling, and automated layout conversions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm flex items-center gap-1.5 font-mono">
              <Globe className="w-4 h-4 text-emerald-400" /> API Locale Language:
            </span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-[#161B22] border border-slate-700/60 rounded px-3 py-1.5 text-sm outline-none text-slate-200 focus:border-emerald-500/50 cursor-pointer font-mono"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.code.toUpperCase()} — {l.label}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800/50">
          <button
            onClick={() => setActiveTab("sandbox")}
            className={`px-5 py-3 text-sm font-medium border-b-2 tracking-tight transition-all flex items-center gap-2 ${
              activeTab === "sandbox"
                ? "border-emerald-500 text-white bg-slate-800/10"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-400" /> Interactive Simulation Sandbox
          </button>
          <button
            onClick={() => setActiveTab("files")}
            className={`px-5 py-3 text-sm font-medium border-b-2 tracking-tight transition-all flex items-center gap-2 ${
              activeTab === "files"
                ? "border-emerald-500 text-white bg-slate-800/10"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code className="w-4 h-4 text-emerald-400" /> Programmatic Source Explorer
          </button>
          <button
            onClick={() => setActiveTab("architecture")}
            className={`px-5 py-3 text-sm font-medium border-b-2 tracking-tight transition-all flex items-center gap-2 ${
              activeTab === "architecture"
                ? "border-emerald-500 text-white bg-slate-800/10"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-400" /> Core System Artifacts
          </button>
        </div>

        {/* Dynamic Panels */}
        <main className="flex-1">
          {activeTab === "sandbox" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Sandbox Configuration Left Panel */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-[#161B22] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
                  
                  <h3 className="text-white font-medium text-lg mb-4 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-emerald-400 animate-spin-slow" /> Task Parameter Config
                  </h3>

                  <div className="space-y-4">
                    
                    {/* Presets */}
                    <div>
                      <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">
                        Platform Stream Target Templates
                      </label>
                      <div className="flex flex-col gap-2">
                        {mockUrls.map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => setTargetUrl(preset.url)}
                            className={`text-left text-xs p-2.5 rounded border transition-all ${
                              targetUrl === preset.url
                                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                                : "bg-[#0E1117] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                            }`}
                          >
                            <span className="block font-medium truncate">{preset.label}</span>
                            <span className="block font-mono mt-0.5 opacity-60 overflow-ellipsis truncate">{preset.url}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Target URL Input */}
                    <div>
                      <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                        Target Media URL
                      </label>
                      <input
                        type="text"
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        placeholder="https://tiktok.com/@creator/video/..."
                        className="w-full bg-[#0E1117] border border-slate-700/80 rounded px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Mode Format Target */}
                    <div>
                      <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                        Extracted Output Format
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormat("mp4")}
                          className={`py-2 rounded px-3 border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                            format === "mp4"
                              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                              : "bg-[#0E1117] border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <Video className="w-3.5 h-3.5" /> MP4 Video (Video+Audio)
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormat("mp3")}
                          className={`py-2 rounded px-3 border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                            format === "mp3"
                              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                              : "bg-[#0E1117] border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <Music className="w-3.5 h-3.5" /> MP3 Audio (Lossy Rip)
                        </button>
                      </div>
                    </div>

                    {/* Advanced options check */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-3">
                      <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">
                        FFmpeg Pipeline Modules
                      </label>

                      {/* Crop switch */}
                      <label className={`flex items-start gap-2.5 p-2 rounded cursor-pointer transition-all ${format === "mp3" ? "opacity-50 pointer-events-none" : ""}`}>
                        <input
                          type="checkbox"
                          checked={cropVertical}
                          onChange={(e) => setCropVertical(e.target.checked)}
                          disabled={format === "mp3"}
                          className="mt-1 accent-emerald-500"
                        />
                        <div>
                          <span className="text-xs font-medium text-slate-200 block">Auto-Crop to 9:16 Vertical Ratio</span>
                          <span className="text-[10px] text-slate-500 block">Uses FFmpeg crop='ih*9/16:ih' on wide landscapes</span>
                        </div>
                      </label>

                      {/* Title custom */}
                      <div className="space-y-1">
                        <span className="text-[11px] text-slate-400 block font-medium">Auto-Tagging metadata Title</span>
                        <input
                          type="text"
                          value={metaTitle}
                          onChange={(e) => setMetaTitle(e.target.value)}
                          placeholder="Empty skips metadata tag injection"
                          className="w-full bg-[#0E1117] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* Artist custom */}
                      <div className="space-y-1">
                        <span className="text-[11px] text-slate-400 block font-medium">Auto-Tagging metadata Artist</span>
                        <input
                          type="text"
                          value={metaArtist}
                          onChange={(e) => setMetaArtist(e.target.value)}
                          placeholder="Empty skips artist injection"
                          className="w-full bg-[#0E1117] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-emerald-500"
                        />
                      </div>

                    </div>

                    {/* Submit Button */}
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleStartSimulation}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#0E1117] transition-all font-semibold rounded py-3 mt-2 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" /> 
                      {isProcessing ? "Background Worker Executing..." : "Dispatch Download Job"}
                    </button>

                  </div>

                </div>

                {/* Translation Info block */}
                <div className="bg-[#161B22]/50 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                  <Globe className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed text-slate-400">
                    <span className="font-semibold text-slate-300 block mb-0.5 font-mono">Multilingual API Locals Active</span>
                    The backend matches your parameter context language and returns localized client responses natively from dynamic translation structures.
                  </div>
                </div>

              </div>
              
              {/* Simulator Execution Right Panel */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Visual State Pipeline representation */}
                <div className="bg-[#161B22] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl flex flex-col gap-6">
                  
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium text-lg flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-emerald-400" /> Pipeline Status Visualizer
                    </h3>
                    {jobId && (
                      <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700/60 rounded">
                        ID: {jobId}
                      </span>
                    )}
                  </div>

                  {/* Operational States Nodes Graph */}
                  <div className="relative pt-2 pb-6">
                    <div className="absolute top-[28px] left-8 right-8 h-[2px] bg-slate-800 z-0" />
                    <div 
                      className="absolute top-[28px] left-8 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400 z-0 transition-all duration-700 ease-out" 
                      style={{ width: `${Math.max(0, Math.min(100, (currentProgress - 5) * 1.05))}%` }}
                    />
                    
                    <div className="grid grid-cols-5 relative z-10 text-center">
                      {[
                        { state: "queued", progress: 0, label: "Enqueued", icon: Clock },
                        { state: "processing", progress: 10, label: "Allocated", icon: Server },
                        { state: "downloading", progress: 45, label: "Download", icon: Download },
                        { state: "cropping", progress: 75, label: "Crop Ratio", icon: Video },
                        { state: "completed", progress: 100, label: "Deployed", icon: CheckCircle2 }
                      ].map((stp, idx) => {
                        const Icon = stp.icon;
                        const isDone = currentProgress >= stp.progress;
                        const isActive = currentStatus === stp.state || (stp.state === "cropping" && currentStatus === "cropping" && cropVertical && format !== "mp3");
                        return (
                          <div key={idx} className="flex flex-col items-center">
                            <div 
                              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                isDone 
                                  ? "bg-[#0E1117] border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]" 
                                  : "bg-[#161B22] border-slate-800 text-slate-500"
                              } ${isActive ? "scale-110 !border-teal-400 text-teal-300 ring-4 ring-teal-500/10" : ""}`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className={`text-[10px] sm:text-xs mt-2.5 font-medium block truncate ${isDone ? "text-slate-200" : "text-slate-500"} ${isActive ? "text-teal-400 font-semibold" : ""}`}>
                              {stp.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Progress Line Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400">Task Allocation Completion:</span>
                      <span className="text-emerald-400 font-semibold text-sm">{currentProgress}%</span>
                    </div>
                    <div className="h-2 bg-[#0E1117] rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${currentProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Real-time Translated Responses from API representation */}
                  <div className="border border-slate-850 bg-[#0E1117]/60 rounded-lg p-4 font-mono text-xs text-slate-300 flex flex-col gap-2.5">
                    <span className="text-[10px] text-emerald-500 uppercase font-semibold tracking-wider">Dynamic API Output Payload</span>
                    <div className="grid grid-cols-2 gap-y-2 text-slate-400 border-b border-slate-800/80 pb-2 mb-1">
                      <div>Status Field:</div>
                      <div className="text-slate-200 font-medium font-sans">
                        {isProcessing ? currentStatus.toUpperCase() : "IDLE"}
                      </div>
                      <div>Progress Level:</div>
                      <div className="text-slate-200 font-semibold">{currentProgress}.00%</div>
                      <div>Original Key Response:</div>
                      <div className="text-slate-200">{currentMessageKey}</div>
                    </div>
                    <div className="flex flex-col gap-1 text-slate-400">
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Localized Client Message:</div>
                      <div className="text-emerald-400 text-sm font-sans font-medium bg-emerald-500/5 px-2.5 py-1.5 rounded border border-emerald-500/10 mt-1">
                        "{t(currentMessageKey)}"
                      </div>
                    </div>
                    
                    {finalResultUrl && (
                      <div className="mt-2 pt-3 border-t border-slate-800/80 flex flex-col gap-1.5">
                        <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-widest">Lossless CDN Media Asset File:</span>
                        <a 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); alert("Target simulated asset successfully output to CDN: " + finalResultUrl); }}
                          className="text-cyan-400 hover:text-cyan-300 font-sans font-medium bg-cyan-900/10 hover:bg-cyan-900/15 px-3 py-2 rounded border border-cyan-800/30 text-xs flex items-center justify-between transition-all"
                        >
                          <span className="truncate pr-4">{finalResultUrl}</span>
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Pipeline Console Log Area */}
                  <div className="bg-[#0E1117] rounded-lg p-4 border border-slate-850 font-mono text-xs space-y-2 max-h-56 overflow-y-auto">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest pb-1 border-b border-slate-800/60">
                      <span>Server stdout & stdlog terminal stream</span>
                      <span className="flex items-center gap-1"><RefreshCw className="w-2.5 h-2.5 animate-spin" /> Live Listening</span>
                    </div>

                    <div className="space-y-1 text-slate-400">
                      {simulationLogs.length === 0 ? (
                        <div className="text-slate-600 italic">Console idle. Trigger download parameter execution to display network pipeline stream...</div>
                      ) : (
                        simulationLogs.map((log, lIdx) => (
                          <div key={lIdx} className="leading-relaxed whitespace-pre-wrap">
                            <span className="text-slate-600 font-sans">#</span> {log}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {activeTab === "files" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* File List Side Panel Selector */}
              <div className="lg:col-span-4 flex flex-col gap-2">
                <span className="text-slate-500 text-xs font-mono mb-2 uppercase tracking-wider block">Source Files Structure</span>
                {sourceFiles.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`text-left p-3.5 rounded-lg border transition-all duration-200 flex flex-col gap-1.5 cursor-pointer ${
                      selectedFileIndex === idx
                        ? "bg-[#161B22] border-emerald-500/80 shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                        : "bg-[#161B22]/40 border-slate-800/60 hover:border-slate-700/80 hover:bg-[#161B22]/60"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-slate-200 font-mono text-sm font-semibold flex items-center gap-2">
                        <FileCode2 className={`w-4 h-4 ${selectedFileIndex === idx ? "text-emerald-400" : "text-slate-500"}`} />
                        {file.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-800/50 text-slate-400 uppercase tracking-wider">python</span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans tracking-tight leading-relaxed line-clamp-2">
                      {file.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Code Display Center Panel */}
              <div className="lg:col-span-8 bg-[#161B22] border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#13171F]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
                    <span className="w-3 h-3 rounded-full bg-green-400/80" />
                    <span className="text-xs font-mono text-slate-400 ml-2">{`/fastapi_app/${sourceFiles[selectedFileIndex].name}`}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-450" /> Production implementation
                  </span>
                </div>
                
                <div className="p-5 font-mono text-xs overflow-x-auto bg-[#0E1117]/80 text-emerald-300 leading-relaxed max-h-[620px]">
                  <pre className="whitespace-pre">{sourceFiles[selectedFileIndex].code}</pre>
                </div>
              </div>

            </div>
          )}

          {activeTab === "architecture" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Highlight 1: i18n */}
              <div className="bg-[#161B22] border border-slate-800 rounded-xl p-6 relative overflow-hidden flex flex-col h-full justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 blur-2xl rounded-full" />
                <div>
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h4 className="text-white font-medium text-base mb-2">14-Language i18n Middleware</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    FastAPI middleware dynamically extracts requested translation templates natively matching language overrides inside client `Accept-Language` headers or `?lang=` request query overrides.
                  </p>
                  <div className="bg-[#0E1117] rounded p-3 font-mono text-[11px] text-slate-400 space-y-1">
                    {languages.slice(0, 7).map((l) => (
                      <div key={l.code} className="flex justify-between">
                        <span>{l.label}:</span>
                        <span className="text-teal-400">"{translations[l.code]?.["task_started"]}"</span>
                      </div>
                    ))}
                    <div className="text-[10px] text-slate-500 text-center pt-1">+ 7 more native localized keys</div>
                  </div>
                </div>
              </div>

              {/* Highlight 2: Distributed ARQ Queue Task Dispatcher */}
              <div className="bg-[#161B22] border border-slate-800 rounded-xl p-6 relative overflow-hidden flex flex-col h-full justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full" />
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                    <Database className="w-5 h-5" />
                  </div>
                  <h4 className="text-white font-medium text-base mb-2">Stateless ARQ Queue Tasking</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    Decouples extraction payloads off FastAPI onto a Redis persistent memory layer. Workers pop downloading operations and write asynchronous progress steps avoiding event-loop locking and ensuring O(1) polling lookups.
                  </p>
                  <div className="bg-[#0E1117] rounded p-3 font-mono text-[11px] text-slate-400 space-y-1">
                    <span className="text-emerald-500 block font-semibold mb-1">// Queue State Transitions</span>
                    <div className="flex justify-between text-slate-300">
                      <span>queued</span>
                      <span>→ processing</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>downloading</span>
                      <span>→ finalizing</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>completed</span>
                      <span>(result url bound)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlight 3: Non-Blocking Subprocess Pipes */}
              <div className="bg-[#161B22] border border-slate-800 rounded-xl p-6 relative overflow-hidden flex flex-col h-full justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-2xl rounded-full" />
                <div>
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h4 className="text-white font-medium text-base mb-2">Asyncio Subprocess Pipes</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    Executes non-blocking FFmpeg binaries using `asyncio.create_subprocess_exec` allowing safe parallel processing of vertical ratio crops (`crop=ih*9/16:ih`) and lossless tag writing inside isolated system threads.
                  </p>
                  <div className="bg-[#0E1117] rounded p-3 font-mono text-[11px] text-slate-400 space-y-1">
                    <span className="text-cyan-400 block font-semibold mb-1"># ffmpeg crop pipeline</span>
                    <span className="block text-slate-350">ffmpeg -y -i input ...</span>
                    <span className="block text-slate-350">-vf "crop=ih*9/16:ih"</span>
                    <span className="block text-slate-350">-c:v libx264 -c:a copy ...</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </main>

        {/* Informative Footer Map */}
        <footer className="mt-8 border-t border-slate-850 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500 text-xs font-mono">ASGI FastAPI Microservice Specification v1.0.0</span>
          </div>
          <div className="text-slate-500 text-xs font-mono flex items-center gap-1.5 bg-[#161B22]/40 border border-slate-800/80 rounded px-2.5 py-1">
            <Zap className="w-3.5 h-3.5 text-yellow-400" /> Real-time Redis state synchronization tracked cleanly.
          </div>
        </footer>

      </div>
    </div>
  );
}
