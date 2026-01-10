import { NextResponse } from 'next/server';

export function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.pathname.split('/')[1] || 'en';
  const error = url.searchParams.get('error');
  const errorDescription = url.searchParams.get('error_description');

  if (error) {
    const loginUrl = new URL(`/${locale}/login`, url.origin);
    loginUrl.searchParams.set('error', error);
    if (errorDescription) loginUrl.searchParams.set('error_description', errorDescription);
    return NextResponse.redirect(loginUrl);
  }

  const redirectUrl = new URL('/auth/callback', url.origin);
  redirectUrl.search = url.search;
  return NextResponse.redirect(redirectUrl);
}
