import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getNewsList, getNewsSources } from '@/lib/news/queries';
import { NewsListClient } from '@/components/news/NewsListClient';

export const dynamic = 'force-dynamic';

export default async function NewsListPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ source?: string; tag?: string; start?: string; end?: string }>;
}) {
  const { locale } = await params;
  const { source, tag, start, end } = await searchParams;
  const t = await getTranslations();

  const sources = await getNewsSources();
  const items = await getNewsList({ source, tag, start, end });

  return (
    <div className="container-shell space-y-8 py-10">
      <div>
        <h1 className="text-3xl font-semibold text-display">{t('news.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('news.subtitle')}</p>
      </div>

      <form className="flex flex-wrap gap-3" method="get">
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
        <input
          type="date"
          name="start"
          defaultValue={start || ''}
          className="h-10 rounded-md border px-3 text-sm"
        />
        <input
          type="date"
          name="end"
          defaultValue={end || ''}
          className="h-10 rounded-md border px-3 text-sm"
        />
        <button className="h-10 rounded-md bg-primary px-4 text-sm text-white" type="submit">
          {t('news.filter')}
        </button>
        <Link href={`/${locale}/news`} className="h-10 rounded-md border px-4 text-sm">
          {t('news.reset')}
        </Link>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('news.empty')}</p>
      ) : (
        <NewsListClient items={items} locale={locale} />
      )}
    </div>
  );
}
