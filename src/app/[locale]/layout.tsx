import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { Metadata } from 'next';
import { seoTranslations, buildHreflangs } from '../../lib/seo-config';
import '../globals.css';

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

const supportedLocales = [
  'en', 'es', 'pt', 'de', 'fr', 'ua', 'pl', 'ja', 'ar', 'tr', 'hi', 'it', 'ko', 'id'
];

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const seo = seoTranslations[locale] || seoTranslations.en;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: `./`,
      languages: buildHreflangs(''),
    },
    openGraph: {
      type: 'website',
      title: seo.title,
      description: seo.description,
      siteName: 'Media Downloader Service',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80',
          width: 1200,
          height: 630,
          alt: seo.title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80'],
    }
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  
  // Validate locale parameter
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  // Set the locale for request-scoped APIs (required for next-intl)
  setRequestLocale(locale);

  // Retrieve messages for dynamic translation injection
  const messages = await getMessages();

  // Set text direction based on Arabic locale
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-teal-500 selection:text-slate-950 antialiased">
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen flex flex-col justify-between">
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
