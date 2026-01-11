import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

const schema = z.object({
  id: z.string().min(1),
  isHidden: z.enum(['true', 'false']),
  status: z.enum(['READY', 'FAILED']).optional(),
});

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const payload = schema.safeParse({
    id: formData.get('id'),
    isHidden: formData.get('isHidden'),
    status: formData.get('status') || undefined,
  });

  if (!payload.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { id, isHidden, status } = payload.data;
  const hidden = isHidden === 'true';

  await prisma.newsItem.update({
    where: { id },
    data: {
      isHidden: hidden,
      ...(status ? { status } : {}),
      editedByUserId: admin.id,
      editedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: admin.id,
      action: hidden ? 'NEWS_HIDE' : 'NEWS_UNHIDE',
      entityType: 'news',
      entityId: id,
      detail: hidden ? 'News hidden' : 'News unhidden',
    },
  });

  const referer = request.headers.get('referer');
  const redirectUrl = referer ? new URL(referer) : new URL('/zh/admin/news', request.url);
  return NextResponse.redirect(redirectUrl, 303);
}
