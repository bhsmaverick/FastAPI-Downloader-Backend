import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Prefix-based list of supported routing locales
  locales: [
    'en', 'es', 'pt', 'de', 'fr', 'ua', 'pl', 'ja', 'ar', 'tr', 'hi', 'it', 'ko', 'id'
  ],
  
  // Safe fallback default language when detection parameters decline
  defaultLocale: 'en',
  
  // Dynamic header and cookie content scanning algorithms
  localeDetection: true
});

export const config = {
  // Safe regex-oriented route matcher preventing interference with static assets or internal API routes
  matcher: [
    // Matches root '/'
    '/',
    // Matches path names starting with any of the 14 locale prefixes
    '/(en|es|pt|de|fr|ua|pl|ja|ar|tr|hi|it|ko|id)/:path*'
  ]
};
