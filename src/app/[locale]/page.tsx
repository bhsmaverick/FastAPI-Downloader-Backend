import { setRequestLocale } from 'next-intl/server';
import MediaDownloaderClient from '../../components/MediaDownloaderClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocalePage({ params }: PageProps) {
  const { locale } = await params;
  
  // Set the locale for static generation paths (required for optimal static parameters compilation in next-intl)
  setRequestLocale(locale);

  return (
    <main id="downloader-page" className="flex-1 relative overflow-hidden w-full">
      {/* Decorative premium design background accent meshes */}
      <div 
        id="bg-accent-blob-1" 
        className="absolute top-1/4 left-1/4 -translate-y-1/2 -translate-x-1/2 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none z-0" 
      />
      <div 
        id="bg-accent-blob-2" 
        className="absolute bottom-1/4 right-1/4 translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none z-0" 
      />

      <div className="w-full relative z-10">
        {/* Render Primary Interactive Downloader Module */}
        <MediaDownloaderClient currentLocale={locale} />

        {/* Dynamic Architectural Footer */}
        <footer id="page-footer" className="text-center text-xs text-slate-500 font-mono py-10 space-y-2 border-t border-slate-900/40">
          <p>© 2026 Media Downloader CDN Service. All rights reserved.</p>
          <p className="text-xxs text-slate-600">
            Engineered with high-traffic, asynchronous task pipelines.
          </p>
        </footer>
      </div>
    </main>
  );
}
