'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { Globe } from 'lucide-react';

export const localeNames: Record<string, string> = {
  en: "🇺🇸 English (EN)",
  es: "🇪🇸 Español (ES)",
  pt: "🇧🇷 Português (PT)",
  de: "🇩🇪 Deutsch (DE)",
  fr: "🇫🇷 Français (FR)",
  ua: "🇺🇦 Українська (UA)",
  pl: "🇵🇱 Polski (PL)",
  ja: "🇯🇵 日本語 (JA)",
  ar: "🇸🇦 العربية (AR)",
  tr: "🇹🇷 Türkçe (TR)",
  hi: "🇮🇳 हिन्दी (HI)",
  it: "🇮🇹 Italiano (IT)",
  ko: "🇰🇷 한국어 (KO)",
  id: "🇮🇩 Bahasa Indonesia (ID)"
};

interface LanguageSwitcherProps {
  currentLocale: string;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: string) => {
    startTransition(() => {
      const segments = pathname.split('/');
      // In prefix-based routing, segments[1] contains the language code
      // Segment 0 is empty (string starts with slash)
      if (segments.length > 1) {
        segments[1] = newLocale;
      } else {
        segments.push(newLocale);
      }
      
      const newPath = segments.join('/');
      router.push(newPath);
    });
  };

  return (
    <div id="language-switcher" className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Globe className={`h-4 w-4 text-teal-500 ${isPending ? 'animate-spin' : ''}`} />
      </div>
      <div className="relative">
        <select
          value={currentLocale}
          onChange={(e) => handleLocaleChange(e.target.value)}
          disabled={isPending}
          className="appearance-none bg-slate-900 border border-slate-700/80 hover:border-teal-400 text-slate-100 py-2 pl-3 pr-10 rounded-xl text-sm cursor-pointer outline-none transition-all disabled:opacity-50 font-sans font-medium"
        >
          {Object.entries(localeNames).map(([code, name]) => (
            <option key={code} value={code} className="bg-slate-950 text-slate-200">
              {name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-400 text-[10px]">
          ▼
        </div>
      </div>
    </div>
  );
}
