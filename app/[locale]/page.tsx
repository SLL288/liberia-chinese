import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { CategoryCard } from '@/components/CategoryCard';
import { PostCard } from '@/components/PostCard';
import { getBanners, getCategories, getFeaturedPosts, getLatestPosts } from '@/lib/data';
import { getNewsList } from '@/lib/news/queries';
import { parseSummary } from '@/lib/news/format';
import { getPublicImageUrl } from '@/lib/news/storage';
import { absoluteUrl, getSiteUrl } from '@/lib/metadata';
import { truncateForShare } from '@/lib/share';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'zh' ? '利比里亚华人分类信息平台' : 'Liberia Chinese Hub';
  const description =
    locale === 'zh'
      ? '分类信息｜求职招聘｜租房二手｜商家名录｜政策资讯'
      : 'Classifieds, jobs, housing, business directory, and policy news.';
  const url = `${await getSiteUrl()}/${locale}`;
  const imageUrl = await absoluteUrl('/og/default-home.jpg');
  const ogImage = await absoluteUrl(`/api/og?type=home&title=${encodeURIComponent(title)}`);

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
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630 }, { url: imageUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title: truncateForShare(title, locale),
      description,
      images: [ogImage],
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  type CategoryItem = Awaited<ReturnType<typeof getCategories>>[number];
  type PostItem = Awaited<ReturnType<typeof getLatestPosts>>[number];
  type BannerItem = Awaited<ReturnType<typeof getBanners>>[number];
  type NewsItem = Awaited<ReturnType<typeof getNewsList>>[number];

  const [categories, featuredPosts, latestPosts, banners, newsItems]: [
    CategoryItem[],
    PostItem[],
    PostItem[],
    BannerItem[],
    NewsItem[],
  ] = await Promise.all([
    getCategories(),
    getFeaturedPosts(),
    getLatestPosts(),
    getBanners('HOME_TOP'),
    getNewsList({}),
  ]);

  return (
    <div className="space-y-14 pb-16">
      <section className="bg-gradient-to-br from-amber-100 via-white to-sky-100 py-16">
        <div className="container-shell grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Liberia Chinese Hub</p>
              <h1 className="text-4xl font-semibold text-display md:text-5xl">
                {t('home.heroTitle')}
              </h1>
              <p className="text-lg text-muted-foreground">{t('home.heroSubtitle')}</p>
            </div>
            <form
              action={`/${locale}/search`}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm md:flex-row"
            >
              <input
                name="keyword"
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
                placeholder={t('home.searchPlaceholder')}
              />
              <Button type="submit">{t('nav.search')}</Button>
            </form>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <Link href={`/${locale}/publish`}>{t('home.publishCTA')}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/${locale}/categories`}>{t('nav.categories')}</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">{t('home.bannerTitle')}</p>
            {banners[0] ? (
              <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={banners[0].imageUrl} alt="banner" className="h-48 w-full object-cover" />
              </div>
            ) : (
              <div className="mt-4 flex h-48 items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
                Banner Slot
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container-shell space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-display">{t('home.popularCategories')}</h2>
          <div className="flex flex-col items-end gap-1 text-sm">
            <Link href={`/${locale}/news`} className="text-primary hover:underline">
              {t('news.title')}
            </Link>
            <Link href={`/${locale}/categories`} className="text-primary hover:underline">
              {t('nav.categories')}
            </Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {categories.slice(0, 6).map((category) => (
            <CategoryCard key={category.id} locale={locale} category={category} />
          ))}
        </div>
      </section>

      <section className="container-shell space-y-6">
        <h2 className="text-2xl font-semibold text-display">{t('home.featuredPosts')}</h2>
        {featuredPosts.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('common.empty')}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {featuredPosts.map((post) => (
              <PostCard key={post.id} locale={locale} post={post} />
            ))}
          </div>
        )}
      </section>

      <section className="container-shell space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-display">{t('news.title')}</h2>
          <Link href={`/${locale}/news`} className="text-sm text-primary hover:underline">
            {t('news.readMore')}
          </Link>
        </div>
        {newsItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('news.empty')}</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            {newsItems.slice(0, 1).map((item) => {
              const summary = parseSummary(item.summaryOverrideZh || item.summaryZh || '');
              const image =
                item.imageOverrideUrl ||
                getPublicImageUrl(item.imagePath) ||
                item.ogImageUrl ||
                '/images/banners/home-top.svg';
              const dateValue = item.publishedAtOverride || item.publishedAt || item.createdAt;
              const title =
                item.titleOverride ||
                (locale === 'zh' ? item.titleZh || item.title : item.titleEn || item.title) ||
                item.url;
              return (
                <Link
                  key={item.id}
                  href={`/${locale}/news/${item.id}`}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:border-primary/40"
                >
                  <div className="overflow-hidden rounded-2xl border border-border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={item.title || ''}
                      className="mx-auto max-h-72 w-full object-contain"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs text-muted-foreground">
                      {item.source.name} · {dateValue.toISOString().slice(0, 10)}
                    </div>
                    <h3 className="text-lg font-semibold text-display">
                      {title}
                    </h3>
                    <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                      {summary.bullets.slice(0, 3).map((bullet, index) => (
                        <li key={`${item.id}-home-${index}`}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                </Link>
              );
            })}
            <div className="space-y-3">
              {newsItems.slice(1, 6).map((item) => {
                const dateValue = item.publishedAtOverride || item.publishedAt || item.createdAt;
                const title =
                  item.titleOverride ||
                  (locale === 'zh' ? item.titleZh || item.title : item.titleEn || item.title) ||
                  item.url;
                return (
                  <Link
                    key={item.id}
                    href={`/${locale}/news/${item.id}`}
                    className="block rounded-xl border border-border bg-white px-4 py-3 text-sm transition hover:border-primary/40"
                  >
                    <div className="text-xs text-muted-foreground">
                      {item.source.name} · {dateValue.toISOString().slice(0, 10)}
                    </div>
                    <div className="mt-2 text-base font-semibold text-display">
                      {title}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <section className="container-shell space-y-6">
        <h2 className="text-2xl font-semibold text-display">{t('home.latestPosts')}</h2>
        {latestPosts.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('common.empty')}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {latestPosts.map((post) => (
              <PostCard key={post.id} locale={locale} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
