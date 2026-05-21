import { MetadataRoute } from 'next';
import { BASE_URL, locales } from '../lib/seo-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '', // Home page
    '/tiktok-downloader',
    '/instagram-downloader',
    '/youtube-downloader'
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate alternate language blocks recursively for each path segment
  paths.forEach((path) => {
    locales.forEach((locale) => {
      const pageUrl = `${BASE_URL}/${locale}${path}`;
      
      // Build alternates with languages mapping to satisfy Google hreflang indexing requirements
      const languagesMap: Record<string, string> = {};
      locales.forEach((altLoc) => {
        languagesMap[altLoc] = `${BASE_URL}/${altLoc}${path}`;
      });
      languagesMap['x-default'] = `${BASE_URL}/en${path}`;

      sitemapEntries.push({
        url: pageUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: path === '' ? 1.0 : 0.8,
        alternates: {
          languages: languagesMap,
        },
      });
    });
  });

  return sitemapEntries;
}
