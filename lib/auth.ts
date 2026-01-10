import { prisma } from '@/lib/prisma';
import { getSupabaseUser } from '@/lib/supabase/server';

export async function getCurrentUser() {
  const supabaseUser = await getSupabaseUser();
  if (!supabaseUser) return null;

  const adminPhone = process.env.ADMIN_PHONE;
  const adminEmail = process.env.ADMIN_EMAIL;
  const promoteToAdmin =
    (adminPhone && supabaseUser.phone && supabaseUser.phone === adminPhone) ||
    (adminEmail && supabaseUser.email && supabaseUser.email === adminEmail);

  const user = await prisma.user.upsert({
    where: { id: supabaseUser.id },
    update: {
      phone: supabaseUser.phone ?? undefined,
      email: supabaseUser.email ?? undefined,
      name: (supabaseUser.user_metadata?.name as string | undefined) ?? undefined,
      ...(promoteToAdmin ? { role: 'ADMIN' } : {}),
    },
    create: {
      id: supabaseUser.id,
      phone: supabaseUser.phone ?? null,
      email: supabaseUser.email ?? null,
      name: (supabaseUser.user_metadata?.name as string | undefined) ?? null,
      role: promoteToAdmin ? 'ADMIN' : 'USER',
    },
  });

  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.role !== 'ADMIN' && user.role !== 'MODERATOR') return null;
  return user;
}
