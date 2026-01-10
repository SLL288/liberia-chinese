import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getNewsItem } from '@/lib/news/queries';
import { parseSummary } from '@/lib/news/format';
import { getPublicImageUrl } from '@/lib/news/storage';
import { ShareDialog } from '@/components/ShareDialog';
import { absoluteUrl, getSiteUrl } from '@/lib/metadata';
import { clampDescription, truncateForShare, isDataUrl } from '@/lib/share';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const item = await getNewsItem(id);
  if (!item || item.isHidden) {
    return {};
  }

  const title = item.titleOverride || item.title || item.url;
  const summary = parseSummary(item.summaryOverrideZh || item.summaryZh || '');
  const bullets = summary.bullets.slice(0, 2).join('；');
  const description = clampDescription(
    bullets || summary.paragraph || '未在原文中明确说明',
    locale === 'zh' ? 110 : 180
  );
  const candidateImage =
    item.imageOverrideUrl ||
    getPublicImageUrl(item.imagePath) ||
    item.ogImageUrl ||
    null;
  const image = candidateImage && !isDataUrl(candidateImage)
    ? candidateImage
    : absoluteUrl('/og/default-news.jpg');
  const url = `${getSiteUrl()}/${locale}/news/${item.id}`;
  const ogImage = absoluteUrl(`/api/og?type=news&title=${encodeURIComponent(title)}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: truncateForShare(title, locale),
      description,
      url,
      siteName: locale === 'zh' ? '利比里亚华人' : 'Liberia Chinese',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'article',
      images: [{ url: ogImage, width: 1200, height: 630 }, { url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title: truncateForShare(title, locale),
      description,
      images: [ogImage],
    },
  };
}

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
  const shareUrl = `${getSiteUrl()}/${locale}/news/${item.id}`;

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

      <ShareDialog url={shareUrl} title={title} locale={locale} />

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
