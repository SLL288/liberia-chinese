import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate, formatCurrency } from '@/lib/utils';
import { getPostById } from '@/lib/data';
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
  const post = await getPostById(id);

  if (!post) {
    return {};
  }

  const title = post.title;
  const rawImage = post.images[0]?.url || null;
  const image = rawImage && !isDataUrl(rawImage) ? absoluteUrl(rawImage) : absoluteUrl('/og/default-post.jpg');
  const priceLabel = post.price
    ? formatCurrency(Number(post.price), post.currency, locale === 'zh' ? 'zh-CN' : 'en-US')
    : locale === 'zh'
    ? '面议'
    : 'Negotiable';
  const location = [post.city, post.region].filter(Boolean).join(' ');
  const descBase = `${priceLabel}${location ? ` · ${location}` : ''} · ${post.description}`;
  const description = clampDescription(descBase, locale === 'zh' ? 100 : 160);
  const url = `${getSiteUrl()}/${locale}/posts/${post.id}`;
  const ogImage = absoluteUrl(
    `/api/og?type=post&title=${encodeURIComponent(title)}&price=${encodeURIComponent(
      priceLabel
    )}&city=${encodeURIComponent(location)}`
  );

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

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations();
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  const priceLabel = post.price
    ? formatCurrency(Number(post.price), post.currency, locale === 'zh' ? 'zh-CN' : 'en-US')
    : locale === 'zh'
    ? '面议'
    : 'Negotiable';
  const shareUrl = `${getSiteUrl()}/${locale}/posts/${post.id}`;

  return (
    <div className="container-shell space-y-8 py-10">
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {post.isTop && <Badge>{t('post.top')}</Badge>}
            {post.isFeatured && <Badge variant="featured">{t('post.featured')}</Badge>}
            {post.isUrgent && <Badge variant="urgent">{t('post.urgent')}</Badge>}
          </div>
          <h1 className="text-3xl font-semibold text-display">{post.title}</h1>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span>
              {t('common.publishedAt')}: {formatDate(post.createdAt, locale === 'zh' ? 'zh-CN' : 'en-US')}
            </span>
            <span>{t('common.views')}: {post.views}</span>
            <span>{t('common.city')}: {post.city ?? '—'}</span>
            <span>{t('common.region')}: {post.region ?? '—'}</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {post.images.length === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border">
                No images
              </div>
            ) : (
              post.images.map((image) => (
                <div key={image.id} className="overflow-hidden rounded-2xl border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.url} alt={post.title} className="h-64 w-full object-cover" />
                </div>
              ))
            )}
          </div>
          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-lg font-semibold">{t('common.contact')}</h2>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <span>{t('post.contactWechat')}: {post.user.wechat ?? '—'}</span>
                <span>{t('post.contactWhatsapp')}: {post.user.whatsapp ?? '—'}</span>
                <span>{t('post.contactPhone')}: {post.user.phone ?? '—'}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline">{t('post.report')}</Button>
                <Button variant="secondary">{t('post.favorite')}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card>
            <CardContent className="space-y-3 p-6">
              <p className="text-sm text-muted-foreground">{t('common.price')}</p>
              <p className="text-2xl font-semibold">{priceLabel}</p>
              <div className="text-sm text-muted-foreground">
                {locale === 'zh' ? post.category.nameZh : post.category.nameEn}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 p-6">
              <h3 className="text-lg font-semibold">{t('post.share')}</h3>
              <p className="text-sm text-muted-foreground">
                {locale === 'zh'
                  ? '复制链接分享给朋友或群组。'
                  : 'Share this listing with your community.'}
              </p>
              <ShareDialog url={shareUrl} title={post.title} locale={locale} />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
