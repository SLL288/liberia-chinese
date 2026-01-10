import { prisma } from '@/lib/prisma';

type NewsFilters = {
  source?: string | null;
  tag?: string | null;
  start?: string | null;
  end?: string | null;
};

export async function getNewsList(filters: NewsFilters) {
  const where: any = {
    status: 'READY',
    isHidden: false,
  };

  if (filters.source) {
    where.sourceId = filters.source;
  }
  if (filters.tag) {
    where.OR = [
      { tags: { has: filters.tag } },
      { tagsOverride: { has: filters.tag } },
    ];
  }

  if (filters.start || filters.end) {
    where.publishedAt = {
      gte: filters.start ? new Date(filters.start) : undefined,
      lte: filters.end ? new Date(filters.end) : undefined,
    };
  }

  return prisma.newsItem.findMany({
    where,
    include: { source: true },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
  });
}

export async function getNewsItem(id: string) {
  return prisma.newsItem.findUnique({
    where: { id },
    include: { source: true },
  });
}

export async function getNewsSources() {
  return prisma.newsSource.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });
}
