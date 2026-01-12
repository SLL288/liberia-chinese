import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { PostListClient } from '@/components/posts/PostListClient';

export const dynamic = 'force-dynamic';

export default async function BusinessDirectoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();
  const category = await prisma.category.findUnique({ where: { slug: 'business' } });

  const posts = category
    ? await prisma.post.findMany({
        where: { status: 'ACTIVE', categoryId: category.id },
        orderBy: { createdAt: 'desc' },
        include: { category: true, images: true, user: true },
      })
    : [];

  return (
    <div className="container-shell space-y-8 py-10">
      <div>
        <h1 className="text-3xl font-semibold text-display">
          {locale === 'zh' ? '商家名录' : 'Business Directory'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {locale === 'zh'
            ? '精选商家信息与服务推广。'
            : 'Highlighted local businesses and services.'}
        </p>
      </div>
      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('common.empty')}</p>
      ) : (
        <PostListClient posts={posts} locale={locale} />
      )}
    </div>
  );
}
