import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) =>
          cookieStore.set({ name, value, ...options }),
        remove: (name: string, options: any) =>
          cookieStore.set({ name, value: '', ...options }),
      },
    }
  );

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const adminPhone = process.env.ADMIN_PHONE;
      const promoteToAdmin = adminPhone && data.user.phone === adminPhone;
      await prisma.user.upsert({
        where: { id: data.user.id },
        update: {
          phone: data.user.phone ?? undefined,
          email: data.user.email ?? undefined,
          name: (data.user.user_metadata?.name as string | undefined) ?? undefined,
          ...(promoteToAdmin ? { role: 'ADMIN' } : {}),
        },
        create: {
          id: data.user.id,
          phone: data.user.phone ?? null,
          email: data.user.email ?? null,
          name: (data.user.user_metadata?.name as string | undefined) ?? null,
          role: promoteToAdmin ? 'ADMIN' : 'USER',
        },
      });
    }
  }

  return NextResponse.redirect(new URL('/', request.url));
}
