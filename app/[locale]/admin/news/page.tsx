import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminNewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string; source?: string; tag?: string; hidden?: string }>;
}) {
  const { locale } = await params;
  const { status, source, tag, hidden } = await searchParams;
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

  const sources = await prisma.newsSource.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });

  const where: any = {};
  if (status) where.status = status;
  if (source) where.sourceId = source;
  if (tag) where.OR = [{ tags: { has: tag } }, { tagsOverride: { has: tag } }];
  if (hidden === 'true') where.isHidden = true;
  if (hidden === 'false') where.isHidden = false;

  const items = await prisma.newsItem.findMany({
    where,
    include: { source: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div className="container-shell space-y-8 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-display">{t('admin.news')}</h1>
          <p className="text-sm text-muted-foreground">{t('news.adminQueue')}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold">{t('news.adminIngest')}</h2>
        <form className="mt-4 flex flex-col gap-3 md:flex-row" action="/api/admin/news/ingest" method="post">
          <input
            name="url"
            required
            placeholder="https://example.com/article"
            className="h-10 flex-1 rounded-md border px-3 text-sm"
          />
          <select name="sourceId" required className="h-10 rounded-md border px-3 text-sm">
            <option value="">{t('news.source')}</option>
            {sources.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <input type="datetime-local" name="publishedAt" className="h-10 rounded-md border px-3 text-sm" />
          <button type="submit" className="h-10 rounded-md bg-primary px-4 text-sm text-white">
            {t('common.submit')}
          </button>
        </form>
      </div>

      <form className="flex flex-wrap gap-3" method="get">
        <select name="status" defaultValue={status || ''} className="h-10 rounded-md border px-3 text-sm">
          <option value="">{t('news.status')}</option>
          <option value="QUEUED">QUEUED</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="READY">READY</option>
          <option value="FAILED">FAILED</option>
        </select>
        <select name="source" defaultValue={source || ''} className="h-10 rounded-md border px-3 text-sm">
          <option value="">{t('news.source')}</option>
          {sources.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <input
          name="tag"
          defaultValue={tag || ''}
          placeholder={t('news.tag')}
          className="h-10 rounded-md border px-3 text-sm"
        />
        <select name="hidden" defaultValue={hidden || ''} className="h-10 rounded-md border px-3 text-sm">
          <option value="">{t('news.hidden')}</option>
          <option value="true">Hidden</option>
          <option value="false">Visible</option>
        </select>
        <button className="h-10 rounded-md bg-primary px-4 text-sm text-white" type="submit">
          {t('news.filter')}
        </button>
        <Link href={`/${locale}/admin/news`} className="h-10 rounded-md border px-4 text-sm">
          {t('news.reset')}
        </Link>
      </form>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{item.titleOverride || item.title || item.url}</h3>
                <p className="text-xs text-muted-foreground">
                  {item.source.name} · {item.status}
                </p>
              </div>
              <Link
                href={`/${locale}/admin/news/${item.id}`}
                className="text-sm text-primary"
              >
                {t('news.adminEdit')}
              </Link>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {item.isFeatured ? <span>{t('news.featured')}</span> : null}
              {item.isHidden ? <span>{t('news.hidden')}</span> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
