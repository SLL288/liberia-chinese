import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { processNewsItem } from '@/lib/news/process';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rateKey = `news-reprocess:${admin.id}`;
  const limit = rateLimit(rateKey, 5, 5 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { id } = await params;
  await prisma.newsItem.update({
    where: { id },
    data: { status: 'QUEUED', error: null },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: admin.id,
      action: 'NEWS_REPROCESS',
      entityType: 'news',
      entityId: id,
      detail: 'Reprocess requested',
    },
  });

  const result = await processNewsItem(id);
  return NextResponse.json({ id, result });
}
