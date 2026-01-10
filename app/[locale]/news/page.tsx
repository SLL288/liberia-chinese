import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getNewsList, getNewsSources } from '@/lib/news/queries';
import { parseSummary } from '@/lib/news/format';
import { getPublicImageUrl } from '@/lib/news/storage';

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
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => {
            const summary = parseSummary(item.summaryOverrideZh || item.summaryZh || '');
            const image =
              item.imageOverrideUrl ||
              getPublicImageUrl(item.imagePath) ||
              item.ogImageUrl ||
              '/images/banners/home-top.svg';
            const tags = item.tagsOverride?.length ? item.tagsOverride : item.tags;
            const dateValue = item.publishedAtOverride || item.publishedAt || item.createdAt;
            return (
              <Link
                key={item.id}
                href={`/${locale}/news/${item.id}`}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:border-primary/40"
              >
                <div className="overflow-hidden rounded-xl border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt={item.title || ''} className="h-40 w-full object-cover" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-display">
                    {item.titleOverride || item.title || item.url}
                  </h2>
                  <div className="text-xs text-muted-foreground">
                    {item.source.name} · {dateValue.toISOString().slice(0, 10)}
                  </div>
                  <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                    {summary.bullets.slice(0, 2).map((bullet, index) => (
                      <li key={`${item.id}-b-${index}`}>{bullet}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {tags?.map((tagItem) => (
                      <span
                        key={`${item.id}-tag-${tagItem}`}
                        className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
                      >
                        {tagItem}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
