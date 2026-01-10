import { headers } from 'next/headers';

export function getSiteUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');

  const headerList = headers();
  const host = headerList.get('x-forwarded-host') || headerList.get('host');
  const proto = headerList.get('x-forwarded-proto') || 'https';
  if (!host) return 'https://liberia-chinese.vercel.app';
  return `${proto}://${host}`;
}

export function absoluteUrl(path: string) {
  if (path.startsWith('http')) return path;
  const base = getSiteUrl();
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}
