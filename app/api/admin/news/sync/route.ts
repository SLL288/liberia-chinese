import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { discoverSourceLinks } from '@/lib/news/discover';
import { processNewsItem } from '@/lib/news/process';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rateKey = `news-sync:${admin.id}`;
  const limit = rateLimit(rateKey, 3, 10 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const sources = await prisma.newsSource.findMany({
    where: { isActive: true },
  });

  let ingested = 0;
  for (const source of sources) {
    const links = await discoverSourceLinks(source.website, source.rssUrl);
    for (const item of links) {
      try {
        await prisma.newsItem.create({
          data: {
            sourceId: source.id,
            url: item.url,
            publishedAt: item.publishedAt ?? null,
            status: 'QUEUED',
          },
        });
        ingested += 1;
      } catch {
        // Ignore duplicates
      }
    }
  }

  const queued = await prisma.newsItem.findMany({
    where: { status: 'QUEUED' },
    orderBy: { createdAt: 'asc' },
    take: 5,
  });

  const processed: string[] = [];
  for (const item of queued) {
    await processNewsItem(item.id);
    processed.push(item.id);
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const redirectUrl = request.headers.get('referer') || `/zh/admin/news`;
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.json({ ingested, processed });
}
