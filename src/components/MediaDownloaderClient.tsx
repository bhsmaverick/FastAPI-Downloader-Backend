'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import { 
  Download, 
  Settings2, 
  Tag, 
  Music, 
  Video, 
  Sparkles, 
  Clock, 
  RotateCw, 
  CheckCircle, 
  AlertCircle,
  Sun,
  Moon,
  Github,
  Zap
} from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

interface MediaDownloaderClientProps {
  currentLocale: string;
}

export default function MediaDownloaderClient({ currentLocale }: MediaDownloaderClientProps) {
  const t = useTranslations();

  // Theme control state layer
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Input States
  const [mediaUrl, setMediaUrl] = useState('');
  const [format, setFormat] = useState('mp4');
  const [cropVertical, setCropVertical] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaArtist, setMetaArtist] = useState('');

  // Service States
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  // Polling management ref
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync design root on mount
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearTimeout(pollingIntervalRef.current);
      }
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Safe programmatic state resetter
  const resetDownloaderState = () => {
    setTaskId(null);
    setStatus('idle');
    setProgress(0);
    setStatusMessage('');
    setResultUrl(null);
    setErrorDetail(null);
    if (pollingIntervalRef.current) {
      clearTimeout(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  // Launch the backend download task or simulation sequence
  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl.trim()) return;

    resetDownloaderState();
    setIsSubmitting(true);
    setStatus('queued');
    setStatusMessage(t('queued'));

    const payload = {
      url: mediaUrl.trim(),
      format: format,
      options: {
        crop_vertical: cropVertical,
        title: metaTitle.trim() || undefined,
        artist: metaArtist.trim() || undefined
      }
    };

    try {
      const response = await axios.post('/api/download', payload);
      
      const { task_id, message } = response.data;
      setTaskId(task_id);
      setStatusMessage(message || t('task_started'));
      setIsSubmitting(false);

      // Start non-blocking polling stream sequence
      startStatusPolling(task_id);

    } catch (err: any) {
      setIsSubmitting(false);
      setStatus('error');
      
      // Axios error detail extractor falling back to localized error translations
      let apiErrorMsg = t('error_enqueuing');
      if (err.response && err.response.data && err.response.data.detail) {
        apiErrorMsg = err.response.data.detail;
      }
      setErrorDetail(apiErrorMsg);
    }
  };

  // Polling logic querying status periodically using safe recursive setTimeout design pattern
  const startStatusPolling = (id: string) => {
    if (pollingIntervalRef.current) {
      clearTimeout(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    const poll = async () => {
      try {
        const res = await axios.get(`/api/status/${id}`);
        const { status: jobStatus, progress: jobProgress, message: jobMsg, result_url } = res.data;

        setStatus(jobStatus);
        setProgress(Math.round(jobProgress));
        setStatusMessage(jobMsg || t(jobStatus) || jobStatus);

        if (result_url) {
          setResultUrl(result_url);
        }

        // Halt setTimeout recursion once terminal states are reached, otherwise queue the next cycle
        if (jobStatus === 'completed') {
          setProgress(100);
          pollingIntervalRef.current = null;
        } else if (jobStatus === 'failed' || jobStatus === 'error') {
          pollingIntervalRef.current = null;
        } else {
          // Schedule next poll ONLY after current execution has completely finished and resolved
          pollingIntervalRef.current = setTimeout(poll, 2000);
        }

      } catch (err: any) {
        // Safe fail recovery on polling issues
        setStatus('error');
        let pollingErr = t('error_processing');
        if (err.response && err.response.data && err.response.data.detail) {
          pollingErr = err.response.data.detail;
        }
        setErrorDetail(pollingErr);
        pollingIntervalRef.current = null;
      }
    };

    // Start running the first poll cycle after the initial 2000ms delay
    pollingIntervalRef.current = setTimeout(poll, 2000);
  };

  return (
    <div 
      id="main-scaffold" 
      className={`w-full min-h-screen transition-colors duration-300 font-sans ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Header Area */}
      <header 
        id="app-header" 
        className={`sticky top-0 z-50 border-b backdrop-blur-md transition-all ${
          theme === 'dark' ? 'bg-slate-950/80 border-slate-900' : 'bg-white/80 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2.5 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-xl text-slate-950 font-bold shrink-0 shadow-lg shadow-teal-500/10">
              <Zap className="h-5 w-5 fill-current" />
            </span>
            <div>
              <span className="text-base font-bold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                CDN Downloader
              </span>
              <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">Enterprise Spec</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark & Light Theme Toggle Box */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-900 border-slate-800 text-teal-400 hover:border-slate-700' 
                  : 'bg-slate-100 border-slate-200 text-emerald-600 hover:bg-slate-200'
              }`}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Language Selection Component */}
            <LanguageSwitcher currentLocale={currentLocale} />
          </div>
        </div>
      </header>

      {/* Hero Header Presentation */}
      <div className="relative pt-16 pb-8 px-4 text-center max-w-4xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono">
          <Sparkles className="h-3.5 w-3.5" /> 
          FFmpeg High-Performance Server Integration Enabled
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          {t('title')}
        </h1>
        <p className={`max-w-2xl mx-auto text-sm sm:text-base leading-relaxed ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
        }`}>
          {t('subtitle')}
        </p>
      </div>

      {/* Workspace Containers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Central Downloader Submission Form */}
          <div className="lg:col-span-8">
            <div className={`border p-6 sm:p-8 rounded-3xl shadow-xl transition-all ${
              theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200/80'
            }`}>
              
              <form onSubmit={handleDownloadSubmit} className="space-y-6">
                
                {/* Embedded URL Input Area */}
                <div className="space-y-2">
                  <label className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
                    Media Stream Destination
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      required
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder={t('input_placeholder')}
                      className={`w-full py-4 pl-4 pr-12 rounded-2xl text-sm outline-none transition-all font-sans font-medium border ${
                        theme === 'dark' 
                          ? 'bg-slate-950/80 border-slate-800 focus:border-teal-500 text-slate-100' 
                          : 'bg-slate-50 border-slate-200 focus:border-emerald-500 text-slate-900'
                      }`}
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                      <Download className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* format + advanced features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Format Selector */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Settings2 className="h-4 w-4 text-teal-400" />
                      {t('select_format')}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormat('mp4')}
                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          format === 'mp4'
                            ? theme === 'dark'
                              ? 'bg-teal-500/10 border-teal-500 text-teal-400'
                              : 'bg-emerald-500/15 border-emerald-500 text-emerald-700'
                            : theme === 'dark'
                              ? 'bg-slate-950/50 border-slate-800 text-slate-400'
                              : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        <Video className="h-4 w-4" />
                        {t('video_mp4')}
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormat('mp3')}
                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          format === 'mp3'
                            ? theme === 'dark'
                              ? 'bg-teal-500/10 border-teal-500 text-teal-400'
                              : 'bg-emerald-500/15 border-emerald-500 text-emerald-700'
                            : theme === 'dark'
                              ? 'bg-slate-950/50 border-slate-800 text-slate-400'
                              : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        <Music className="h-4 w-4" />
                        {t('audio_mp3')}
                      </button>
                    </div>
                  </div>

                  {/* Vert Aspect cropping toggle */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Settings2 className="h-4 w-4 text-teal-400" />
                      {t('ffmpeg_options')}
                    </label>
                    <button
                      type="button"
                      onClick={() => setCropVertical(!cropVertical)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        cropVertical
                          ? theme === 'dark'
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                            : 'bg-emerald-500/10 border-emerald-400 text-emerald-700 font-semibold'
                          : theme === 'dark'
                            ? 'bg-slate-950/50 border-slate-800 text-slate-400'
                            : 'bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={cropVertical}
                        onChange={() => {}}
                        className="accent-emerald-500 pointer-events-none mt-0.5 rounded"
                      />
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold block">{t('crop_vertical')}</span>
                        <span className="text-[10px] text-slate-500 block leading-tight">
                          {t('crop_desc').slice(0, 52)}...
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* ID3 tagging forms */}
                <div className={`p-4 sm:p-5 rounded-2xl border ${
                  theme === 'dark' ? 'bg-slate-950/80 border-slate-800/80' : 'bg-slate-50 border-slate-200/80'
                }`}>
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-4 w-4 text-teal-400" />
                    <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
                      Asynchronous Metadata Injection (FFmpeg)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-xxs text-slate-500 font-bold uppercase">{t('metadata_title')}</span>
                      <input
                        type="text"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        placeholder="e.g. Dynamic Title Asset"
                        className={`w-full p-2.5 rounded-lg text-xs outline-none border transition-all ${
                          theme === 'dark'
                            ? 'bg-slate-900 border-slate-800 focus:border-slate-700 text-slate-200'
                            : 'bg-white border-slate-200 focus:border-slate-400 text-slate-800'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-xxs text-slate-500 font-bold uppercase">{t('metadata_artist')}</span>
                      <input
                        type="text"
                        value={metaArtist}
                        onChange={(e) => setMetaArtist(e.target.value)}
                        placeholder="e.g. Media Artist Tag"
                        className={`w-full p-2.5 rounded-lg text-xs outline-none border transition-all ${
                          theme === 'dark'
                            ? 'bg-slate-900 border-slate-800 focus:border-slate-700 text-slate-200'
                            : 'bg-white border-slate-200 focus:border-slate-400 text-slate-800'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Submission Action button */}
                <button
                  type="submit"
                  disabled={isSubmitting || (status !== 'idle' && status !== 'completed' && status !== 'error' && status !== 'failed')}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-450 hover:from-teal-450 hover:to-emerald-450 text-slate-950 font-bold text-sm shadow-xl hover:shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <RotateCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span>{t('download')}</span>
                </button>

              </form>
            </div>
          </div>

          {/* Right Area: System Diagnostics, Progress, and Asset Download links */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Realtime pipeline processing card */}
            <div className={`border p-6 rounded-3xl transition-all ${
              theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80 shadow-xl' : 'bg-white border-slate-200/80 shadow-md'
            }`}>
              <h3 className="text-xs font-bold font-mono text-slate-400 tracking-wider uppercase pb-3 border-b border-slate-800 flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal-400" />
                Live Engine Pipeline
              </h3>

              {status === 'idle' ? (
                <div className="py-12 flex flex-col items-center text-center space-y-3">
                  <Download className="h-10 w-10 text-slate-700 animate-pulse stroke-[1.5px]" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pipeline Ready</p>
                    <p className="text-[10px] text-slate-600 mt-1 font-mono">Accepting asynchronous secure streams.</p>
                  </div>
                </div>
              ) : (
                <div className="py-4 space-y-6">
                  {/* Status Indicator Row */}
                  <div className="flex items-center justify-between">
                    <span className="text-xxs font-bold text-slate-500 font-mono uppercase">Engine Status:</span>
                    <span className={`text-[10px] font-bold font-mono py-0.5 px-2.5 rounded-full border uppercase ${
                      status === 'completed'
                        ? 'bg-emerald-550/10 border-emerald-500 text-emerald-400'
                        : status === 'failed' || status === 'error'
                          ? 'bg-rose-500/10 border-rose-500 text-rose-400'
                          : 'bg-teal-500/10 border-teal-500 text-teal-400'
                    }`}>
                      {status}
                    </span>
                  </div>

                  {/* Central Progress Circle or Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xxs font-mono text-slate-500">
                      <span>Proportion Complete:</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Active Translation Indicator Message */}
                  <div className={`p-4 rounded-xl text-xs flex items-start gap-2.5 border leading-relaxed ${
                    status === 'completed'
                      ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-300'
                      : status === 'failed' || status === 'error'
                        ? 'bg-rose-950/20 border-rose-900/30 text-rose-300'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                  }`}>
                    {status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : status === 'failed' || status === 'error' ? (
                      <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    ) : (
                      <RotateCw className="h-4 w-4 text-teal-400 animate-spin shrink-0 mt-0.5" />
                    )}
                    <div className="font-sans space-y-1">
                      <p className="font-bold">{t('status_msg')}</p>
                      <p className="text-xxs text-slate-400">{statusMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Detail Notification Block */}
              {errorDetail && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 space-y-2 animate-fade-in">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-xxs">
                    <AlertCircle className="h-4 w-4 text-rose-400" />
                    <span>Localized Failure Block</span>
                  </div>
                  <p>{errorDetail}</p>
                  <button 
                    onClick={resetDownloaderState}
                    className="text-xxs font-bold text-teal-400 underline cursor-pointer hover:text-teal-350"
                  >
                    Reset Pipeline
                  </button>
                </div>
              )}

              {/* Download Success Resolution Block */}
              {status === 'completed' && resultUrl && (
                <div className="pt-6 border-t border-slate-800/80 space-y-3 animate-fade-in text-center mt-4">
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">Resolved CDN Artifact Link</span>
                    <p className="text-xs font-mono text-teal-400 break-all p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                      {resultUrl}
                    </p>
                  </div>
                  <a 
                    href={resultUrl}
                    download
                    className="w-full flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-350 shadow-lg cursor-pointer transition-all"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Save Asset Directly</span>
                  </a>
                  <button
                    onClick={resetDownloaderState}
                    className="text-xxs text-slate-500 hover:text-slate-300 font-mono block mx-auto underline mt-2"
                  >
                    Clear Task & Download New
                  </button>
                </div>
              )}
            </div>

            {/* Platform technical specifications info card */}
            <div className={`p-6 rounded-3xl border text-xs font-mono space-y-3 ${
              theme === 'dark' ? 'bg-slate-900/30 border-slate-900/80 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
            }`}>
              <div className="flex items-center justify-between text-xxs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-800/40">
                <span>Infrastructure Specs</span>
                <span className="text-teal-400">ONLINE</span>
              </div>
              <div className="flex justify-between">
                <span>Network Protocol:</span>
                <span className="text-slate-200">X-Accel-Redirect</span>
              </div>
              <div className="flex justify-between">
                <span>Worker Pool:</span>
                <span className="text-slate-200">10 Threads</span>
              </div>
              <div className="flex justify-between">
                <span>Transcoder Backend:</span>
                <span className="text-slate-200 font-sans">FastAPI & ARQ</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
