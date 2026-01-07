import { NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';
import { locales, defaultLocale } from './i18n';

function getLocale(request: Request) {
  const headers = Object.fromEntries(request.headers as any);
  const negotiator = new Negotiator({ headers });
  const languages = negotiator.languages();
  return match(languages, locales as unknown as string[], defaultLocale as string);
}

export function middleware(request: any) {
  const pathname = request.nextUrl.pathname;

  // Ignore internal paths and assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return;
  }

  const pathnameIsMissingLocale = (locales as readonly string[]).every(
    (locale) => !pathname.startsWith(`/${locale}`)
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
