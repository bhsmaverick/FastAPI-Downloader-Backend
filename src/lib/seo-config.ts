export interface LocalizedSeoData {
  title: string;
  description: string;
  keywords: string[];
}

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://media-downloader.com';

export const seoTranslations: Record<string, LocalizedSeoData> = {
  en: {
    title: "High-Traffic Multi-Platform Media Downloader | Watermark-Free HD Player",
    description: "Download video and audio streams seamlessly from TikTok, Instagram, YouTube. Supercharged with secure multi-lingual FFmpeg transcoding pipelines.",
    keywords: ["media downloader", "tiktok downloader", "instagram downloader", "ffmpeg options", "mp3 audio converter", "watermark free"]
  },
  es: {
    title: "Descargador de Medios de Alto Tráfico | Descarga HD Sin Marca de Agua",
    description: "Descargue videos y audios sin problemas desde TikTok, Instagram, YouTube. Optimizado con transcodificación segura FFmpeg multilingüe.",
    keywords: ["descargador de videos", "descargar tiktok", "descargar instagram", "conversor mp3", "sin marca de agua"]
  },
  pt: {
    title: "Baixador de Mídia de Alto Tráfego | Download HD sem Marca D'água",
    description: "Baixe fluxos de vídeo e áudio do TikTok, Instagram, YouTube de forma simples. Equipado com transcodificação FFmpeg segura e multilíngue.",
    keywords: ["baixador de midia", "baixar tiktok", "baixar instagram", "converter para mp3", "sem marca d'agua"]
  },
  de: {
    title: "Hochleistungs-Media-Downloader | Wasserzeichenfreie HD-Downloads",
    description: "Videos und Audio reibungslos von TikTok, Instagram, YouTube herunterladen. Ausgestattet mit sicheren, mehrsprachigen FFmpeg-Transkodierungs-Pipelines.",
    keywords: ["media downloader", "tiktok herunterladen", "instagram downloader", "mp3 konverter", "ohne wasserzeichen"]
  },
  fr: {
    title: "Téléchargeur de Médias à Haut Trafic | Vidéos HD sans Filigrane",
    description: "Téléchargez des vidéos et audios facilement depuis TikTok, Instagram, YouTube. Propulsé par des pipelines de transcodage FFmpeg sécurisés.",
    keywords: ["telechargeur de moidas", "telecharger tiktok", "telecharger instagram", "convertisseur mp3", "sans filigrane"]
  },
  ua: {
    title: "Високонавантажений Завантажувач Медіа | HD без Водяних Знаків",
    description: "Безперешкодно завантажуйте відео та аудіо з TikTok, Instagram, YouTube. Швидке конвертування через захищені процеси FFmpeg.",
    keywords: ["завантажувач медіа", "завантажити тікток", "завантажити інстаграм", "конвертер mp3", "без водяних знаків"]
  },
  pl: {
    title: "Pobieracz Mediów o Wysokim Natężeniu | HD bez Znaku Wodnego",
    description: "Pobieraj filmy i pliki audio z TikToka, Instagrama, YouTube bez zakłóceń. Zoptymalizowany pod kątem szybkiego kodowania FFmpeg.",
    keywords: ["pobieracz mediów", "pobierz tiktok", "pobierz instagram", "konwerter mp3", "bez znaku wodnego"]
  },
  ja: {
    title: "高トラフィック対応メディアダウンローダー | ウォーターマークなしHD保存",
    description: "TikTok、Instagram、YouTubeから動画・音声を素早くダウンロード。高度なFFmpegエンコーディングパイプラインを搭載。",
    keywords: ["メディアダウンロード", "tiktok 保存", "インスタ ダウンロード", "mp3 変換", "ロゴなし"]
  },
  ar: {
    title: "مُنَزِّل وسائط عالٍ السرعة | تحميل فيديو بدقة HD بدون علامة مائية",
    description: "تحميل مقاطع الفيديو والصوت بسلاسة من تيك توك، إنستغرام، يوتيوب. مدعوم بخطوط معالجة FFmpeg آمنة وعالية الأداء.",
    keywords: ["منزل وسائط", "تحميل تيك توك", "تحميل انستغرام", "تحويل mp3", "بدون علامة مائية"]
  },
  tr: {
    title: "Yüksek Trafikli Medya İndirici | Filigransız HD Video İndir",
    description: "TikTok, Instagram, YouTube üzerinden kusursuz video ve ses indirme. Güvenli, çok dilli FFmpeg dönüştürme altyapısıyla desteklenmiştir.",
    keywords: ["medya indirici", "tiktok indir", "instagram indir", "mp3 donusturucu", "filigransiz"]
  },
  hi: {
    title: "हाई-ट्रैफ़िक मीडिया डाउनलोडर | वॉटरमार्क-मुक्त HD मीडिया डाउनलोड",
    description: "TikTok, Instagram, YouTube से आसानी से वीडियो और ऑडियो डाउनलोड करें। सुरक्षित बहुभाषी FFmpeg ट्रांसकोडिंग पाइपलाइनों से लैस।",
    keywords: ["मीडिया डाउनलोडर", "टिकटॉक डाउनलोडर", "इंस्टाग्राम डाउनलोडर", "mp3 कनवर्टर", "बिना वॉटरमार्क"]
  },
  it: {
    title: "Downloader Multimediale ad Alto Traffico | Downloader HD Senza Filigrana",
    description: "Scarica flussi video e audio da TikTok, Instagram, YouTube in modo ottimale. Supportato da pipeline di transcodifica sicure FFmpeg.",
    keywords: ["downloader multimediale", "scaricare tiktok", "scaricare instagram", "convertitore mp3", "senza filigrana"]
  },
  ko: {
    title: "고트래픽 멀티 다운로더 | 워터마크 없는 초고화질 미디어 다운로드",
    description: "TikTok, Instagram, YouTube에서 부드럽게 비디오 및 오디오 다운로드. 안전한 다국어 FFmpeg 트랜스코딩 파이프라인 탑재.",
    keywords: ["미디어 다운로더", "틱톡 다운로드", "인스타 다운로드", "mp3 변환", "워터마크 제거"]
  },
  id: {
    title: "Pengunduh Media Trafik Tinggi | Unduh Tanpa Tanda Air Kualitas HD",
    description: "Unduh file video dan audio dengan mulus dari TikTok, Instagram, YouTube. Dioptimalkan dengan pipa pemrosesan transkode FFmpeg.",
    keywords: ["pengunduh media", "unduh tiktok", "unduh instagram", "konverter mp3", "tanpa watermark"]
  }
};

export const locales = [
  'en', 'es', 'pt', 'de', 'fr', 'ua', 'pl', 'ja', 'ar', 'tr', 'hi', 'it', 'ko', 'id'
];

/**
 * Builds standard alternates definition containing languages mapping for all supported locales.
 */
export function buildHreflangs(currentPath: string = '') {
  const languages: Record<string, string> = {};
  
  locales.forEach((loc) => {
    languages[loc] = `${BASE_URL}/${loc}${currentPath}`;
  });

  // Include x-default alternate parameter pointing to master localization
  languages['x-default'] = `${BASE_URL}/en${currentPath}`;

  return languages;
}
