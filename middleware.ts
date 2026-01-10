import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
});

export default async function middleware(request: NextRequest) {
  let response = intlMiddleware(request) as NextResponse | undefined;
  if (!response) {
    response = NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnon) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnon, {
    cookies: {
      get: (name: string) => request.cookies.get(name)?.value,
      set: (name: string, value: string, options: any) => {
        response?.cookies.set({ name, value, ...options });
      },
      remove: (name: string, options: any) => {
        response?.cookies.set({ name, value: '', ...options });
      },
    },
  });

  await supabase.auth.getSession();
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*|auth/callback).*)'],
};
