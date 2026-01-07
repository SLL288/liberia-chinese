import { prisma } from '@/lib/prisma';

export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { nameZh: 'asc' }],
  });
}

export async function getFeaturedPosts() {
  return prisma.post.findMany({
    where: { status: 'ACTIVE', isFeatured: true },
    orderBy: [{ featuredUntil: 'desc' }, { createdAt: 'desc' }],
    include: { category: true, images: true, user: true },
    take: 8,
  });
}

export async function getLatestPosts() {
  return prisma.post.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
    include: { category: true, images: true, user: true },
    take: 12,
  });
}

export async function getPostById(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: { category: true, images: true, user: true },
  });
}

type SearchFilters = {
  keyword?: string;
  category?: string;
  city?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
};

export async function searchPosts(filters: SearchFilters) {
  const where = {
    status: 'ACTIVE',
    ...(filters.category
      ? {
          category: { slug: filters.category },
        }
      : {}),
    ...(filters.city ? { city: { contains: filters.city } } : {}),
    ...(filters.region ? { region: { contains: filters.region } } : {}),
    ...(filters.keyword
      ? {
          OR: [
            { title: { contains: filters.keyword } },
            { description: { contains: filters.keyword } },
          ],
        }
      : {}),
    ...(filters.minPrice || filters.maxPrice
      ? {
          price: {
            gte: filters.minPrice ?? undefined,
            lte: filters.maxPrice ?? undefined,
          },
        }
      : {}),
  };

  let orderBy: any = { createdAt: 'desc' };
  if (filters.sort === 'price_low') {
    orderBy = { price: 'asc' };
  }
  if (filters.sort === 'price_high') {
    orderBy = { price: 'desc' };
  }

  return prisma.post.findMany({
    where,
    orderBy,
    include: { category: true, images: true, user: true },
    take: 40,
  });
}

export async function getBanners(position: string) {
  return prisma.banner.findMany({
    where: {
      position,
      isActive: true,
      OR: [{ startAt: null }, { startAt: { lte: new Date() } }],
      AND: [{ endAt: null }, { endAt: { gte: new Date() } }],
    },
    orderBy: [{ weight: 'desc' }],
  });
}

export async function getPricingPlans() {
  return prisma.pricingPlan.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  });
}

export async function getUserPosts(userId: string) {
  return prisma.post.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: { category: true, images: true },
  });
}
