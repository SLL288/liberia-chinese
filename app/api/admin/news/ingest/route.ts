import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const payloadSchema = z.object({
  url: z.string().url(),
  sourceId: z.string().min(1),
  publishedAt: z.string().optional(),
});

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rateKey = `news-ingest:${admin.id}`;
  const limit = rateLimit(rateKey, 10, 10 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const contentType = request.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await request.json() : Object.fromEntries(await request.formData());
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const data = parsed.data;
  const existing = await prisma.newsItem.findUnique({ where: { url: data.url } });
  if (existing) {
    return NextResponse.json({ id: existing.id, status: existing.status });
  }

  const publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;
  const newsItem = await prisma.newsItem.create({
    data: {
      url: data.url,
      sourceId: data.sourceId,
      publishedAt: publishedAt && !Number.isNaN(publishedAt.getTime()) ? publishedAt : null,
      status: 'QUEUED',
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: admin.id,
      action: 'NEWS_INGEST',
      entityType: 'news',
      entityId: newsItem.id,
      detail: `Ingested ${data.url}`,
      metadata: { sourceId: data.sourceId },
    },
  });

  if (!isJson) {
    const redirectUrl = request.headers.get('referer') || `/zh/admin/news`;
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.json({ id: newsItem.id, status: newsItem.status });
}
