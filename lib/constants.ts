export const SITE_NAME = 'Liberian Chinese Society';
export const SITE_URL = 'https://liberiachinese.com';
export const SITE_DESCRIPTION = 'Promoting Chinese culture, community support, and business networking in Liberia';

export const DEFAULT_LOCALE = 'en' as const;
export const LOCALES = ['en', 'zh'] as const;
export type Locale = (typeof LOCALES)[number];

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  EVENTS: '/events',
  NEWS: '/news',
  DIRECTORY: '/directory',
  RESOURCES: '/resources',
  GALLERY: '/gallery',
  CONTACT: '/contact',
  DONATE: '/donate',
  MEMBERSHIP: '/membership',
  ADMIN: '/admin',
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
} as const;
