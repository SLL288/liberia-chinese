import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  let categories: { slug: string }[] = [];
  let posts: { id: string; updatedAt: Date }[] = [];
  let newsItems: { id: string; updatedAt: Date }[] = [];
  try {
    [categories, posts, newsItems] = await Promise.all([
      prisma.category.findMany({ where: { isActive: true }, select: { slug: true } }),
      prisma.post.findMany({ where: { status: 'ACTIVE' }, select: { id: true, updatedAt: true } }),
      prisma.newsItem.findMany({
        where: { status: 'READY', isHidden: false },
        select: { id: true, updatedAt: true },
      }),
    ]);
  } catch {
    // Allow sitemap to render even if the database isn't configured yet.
  }

  const baseRoutes = [
    '',
    '/zh',
    '/en',
    '/zh/categories',
    '/en/categories',
    '/zh/search',
    '/en/search',
    '/zh/business',
    '/en/business',
    '/zh/login',
    '/en/login',
    '/zh/news',
    '/en/news',
  ];

  const categoryRoutes = categories.flatMap((category) => [
    { url: `${siteUrl}/zh/categories/${category.slug}`, lastModified: new Date() },
    { url: `${siteUrl}/en/categories/${category.slug}`, lastModified: new Date() },
  ]);

  const postRoutes = posts.flatMap((post) => [
    { url: `${siteUrl}/zh/posts/${post.id}`, lastModified: post.updatedAt },
    { url: `${siteUrl}/en/posts/${post.id}`, lastModified: post.updatedAt },
  ]);

  const newsRoutes = newsItems.flatMap((item) => [
    { url: `${siteUrl}/zh/news/${item.id}`, lastModified: item.updatedAt },
    { url: `${siteUrl}/en/news/${item.id}`, lastModified: item.updatedAt },
  ]);

  return [
    ...baseRoutes.map((route) => ({ url: `${siteUrl}${route}`, lastModified: new Date() })),
    ...categoryRoutes,
    ...postRoutes,
    ...newsRoutes,
  ];
}
