import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.newsItem.deleteMany({});

  await prisma.auditLog.create({
    data: {
      actorUserId: admin.id,
      action: 'NEWS_DELETE_ALL',
      entityType: 'news',
      entityId: 'ALL',
      detail: 'All news items deleted',
    },
  });

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const referer = request.headers.get('referer');
    const redirectUrl = referer ? new URL(referer) : new URL('/zh/admin/news', request.url);
    return NextResponse.redirect(redirectUrl, 303);
  }

  return NextResponse.json({ ok: true });
}
