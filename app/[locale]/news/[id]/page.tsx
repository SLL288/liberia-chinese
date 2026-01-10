import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getNewsItem } from '@/lib/news/queries';
import { parseSummary } from '@/lib/news/format';
import { getPublicImageUrl } from '@/lib/news/storage';

export const dynamic = 'force-dynamic';

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations();
  const item = await getNewsItem(id);

  if (!item || item.isHidden) {
    notFound();
  }

  const summary = parseSummary(item.summaryOverrideZh || item.summaryZh || '');
  const title = item.titleOverride || item.title || item.url;
  const whyItMatters = item.whyItMattersOverride || item.whyItMatters;
  const image =
    item.imageOverrideUrl ||
    getPublicImageUrl(item.imagePath) ||
    item.ogImageUrl ||
    '/images/banners/home-top.svg';
  const tags = item.tagsOverride?.length ? item.tagsOverride : item.tags;
  const dateValue = item.publishedAtOverride || item.publishedAt || item.createdAt;

  return (
    <div className="container-shell space-y-8 py-10">
      <div className="flex flex-col gap-3">
        <div className="text-sm text-muted-foreground">
          {item.source.name} · {dateValue.toISOString().slice(0, 10)}
        </div>
        <h1 className="text-3xl font-semibold text-display">{title}</h1>
        <p className="text-sm text-muted-foreground">{t('news.disclaimer')}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={title} className="h-72 w-full object-cover" />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">AI Summary</h2>
        {summary.bullets.length > 0 ? (
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {summary.bullets.map((bullet, index) => (
              <li key={`${item.id}-summary-${index}`}>{bullet}</li>
            ))}
          </ul>
        ) : null}
        <p className="text-sm text-muted-foreground">{summary.paragraph}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">{t('news.whyItMatters')}</h2>
        <p className="text-sm text-muted-foreground">
          {whyItMatters || '未在原文中明确说明'}
        </p>
      </section>

      <section className="flex flex-wrap gap-2">
        {tags?.map((tagItem) => (
          <span
            key={`${item.id}-tag-${tagItem}`}
            className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
          >
            {tagItem}
          </span>
        ))}
      </section>

      <div className="flex items-center justify-between border-t border-border pt-6 text-sm">
        <Link href={item.url} className="text-primary" target="_blank" rel="noreferrer">
          {t('news.readMore')}
        </Link>
        <Link href={`/${locale}/news`} className="text-muted-foreground">
          ← {t('news.title')}
        </Link>
      </div>
    </div>
  );
}
