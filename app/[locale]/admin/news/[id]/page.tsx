import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { NewsEditor } from '@/components/admin/NewsEditor';

export const dynamic = 'force-dynamic';

export default async function AdminNewsEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations();
  const admin = await requireAdmin();

  if (!admin) {
    return (
      <div className="container-shell py-16">
        <h1 className="text-2xl font-semibold">{t('admin.title')}</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {locale === 'zh' ? '仅管理员可访问。' : 'Admins only.'}
        </p>
      </div>
    );
  }

  const item = await prisma.newsItem.findUnique({
    where: { id },
  });

  if (!item) {
    notFound();
  }

  return (
    <div className="container-shell space-y-6 py-10">
      <Link href={`/${locale}/admin/news`} className="text-sm text-muted-foreground">
        ← {t('admin.news')}
      </Link>
      <h1 className="text-3xl font-semibold text-display">{t('news.adminEdit')}</h1>
      <NewsEditor
        locale={locale}
        item={{
          id: item.id,
          url: item.url,
          title: item.title,
          publishedAt: item.publishedAt?.toISOString() ?? null,
          rawExcerpt: item.rawExcerpt,
          summaryZh: item.summaryZh,
          whyItMatters: item.whyItMatters,
          tags: item.tags,
          ogImageUrl: item.ogImageUrl,
          imagePath: item.imagePath,
          titleOverride: item.titleOverride,
          publishedAtOverride: item.publishedAtOverride?.toISOString() ?? null,
          summaryOverrideZh: item.summaryOverrideZh,
          whyItMattersOverride: item.whyItMattersOverride,
          tagsOverride: item.tagsOverride,
          imageOverrideUrl: item.imageOverrideUrl,
          isHidden: item.isHidden,
          isFeatured: item.isFeatured,
          editorNote: item.editorNote,
        }}
      />
    </div>
  );
}
