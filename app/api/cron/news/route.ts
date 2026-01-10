import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { discoverSourceLinks } from '@/lib/news/discover';
import { processNewsItem } from '@/lib/news/process';

export const runtime = 'nodejs';

function isAuthorized(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  const cronSecret = process.env.CRON_SECRET;
  const githubSecret = process.env.GITHUB_CRON_SECRET;
  return token && (token === cronSecret || token === githubSecret);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      } catch (error) {
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

  return NextResponse.json({ ingested, processed });
}

export async function GET(request: Request) {
  return POST(request);
}
