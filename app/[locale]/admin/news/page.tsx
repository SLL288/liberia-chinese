import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { getNewsSources } from '@/lib/news/queries';
import { requireAdmin } from '@/lib/auth';
import { AdminNewsList } from '@/components/admin/AdminNewsList';

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
  const statusLabels =
    locale === 'zh'
      ? { QUEUED: '排队', PROCESSING: '处理中', READY: '已发布', FAILED: '失败' }
      : { QUEUED: 'Queued', PROCESSING: 'Processing', READY: 'Ready', FAILED: 'Failed' };
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

  const sources = await getNewsSources();

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
        <div className="flex items-center gap-3 text-sm">
          <form action="/api/admin/news/delete-all" method="post">
            <button className="text-destructive hover:underline" type="submit">
              {t('news.deleteAll')}
            </button>
          </form>
          <a href={`/${locale}/admin`} className="text-primary hover:underline">
            {t('admin.back')}
          </a>
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

      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold">{t('news.adminSync')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t('news.adminSyncHint')}</p>
        <form className="mt-4" action="/api/admin/news/sync" method="post">
          <button type="submit" className="h-10 rounded-md bg-primary px-4 text-sm text-white">
            {t('news.adminSyncAction')}
          </button>
        </form>
      </div>

      <form className="flex flex-wrap gap-3" method="get">
        <select name="status" defaultValue={status || ''} className="h-10 rounded-md border px-3 text-sm">
          <option value="">{t('news.status')}</option>
          <option value="QUEUED">{statusLabels.QUEUED}</option>
          <option value="PROCESSING">{statusLabels.PROCESSING}</option>
          <option value="READY">{statusLabels.READY}</option>
          <option value="FAILED">{statusLabels.FAILED}</option>
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
          <option value="true">{t('news.hidden')}</option>
          <option value="false">{t('news.visible')}</option>
        </select>
        <button className="h-10 rounded-md bg-primary px-4 text-sm text-white" type="submit">
          {t('news.filter')}
        </button>
        <a href={`/${locale}/admin/news`} className="h-10 rounded-md border px-4 text-sm">
          {t('news.reset')}
        </a>
      </form>

      <AdminNewsList items={items} locale={locale} />
    </div>
  );
}
