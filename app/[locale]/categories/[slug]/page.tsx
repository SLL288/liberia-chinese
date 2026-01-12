import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { PostListClient } from '@/components/posts/PostListClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations();

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    notFound();
  }

  type PostWithRelations = Awaited<ReturnType<typeof prisma.post.findMany>>[number];

  const posts: PostWithRelations[] = await prisma.post.findMany({
    where: { status: 'ACTIVE', categoryId: category.id },
    orderBy: { createdAt: 'desc' },
    include: { category: true, images: true, user: true },
  });

  return (
    <div className="container-shell space-y-8 py-10">
      <div>
        <p className="text-sm text-muted-foreground">{t('nav.categories')}</p>
        <h1 className="text-3xl font-semibold text-display">
          {locale === 'zh' ? category.nameZh : category.nameEn}
        </h1>
      </div>
      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('common.empty')}</p>
      ) : (
        <PostListClient posts={posts} locale={locale} />
      )}
    </div>
  );
}
