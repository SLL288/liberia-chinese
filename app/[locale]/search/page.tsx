import { getTranslations } from 'next-intl/server';
import { searchPosts, getCategories } from '@/lib/data';
import { PostCard } from '@/components/PostCard';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

type SearchParams = {
  keyword?: string;
  category?: string;
  city?: string;
  region?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
};

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const t = await getTranslations();
  const [categories, posts] = await Promise.all([
    getCategories(),
    searchPosts({
      keyword: query.keyword,
      category: query.category,
      city: query.city,
      region: query.region,
      minPrice: query.minPrice ? Number(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
      sort: query.sort,
    }),
  ]);

  return (
    <div className="container-shell space-y-8 py-10">
      <h1 className="text-3xl font-semibold text-display">{t('search.title')}</h1>
      <form className="grid gap-4 rounded-2xl border border-border bg-white p-5 md:grid-cols-6">
        <Input name="keyword" placeholder={t('search.keyword')} defaultValue={query.keyword} className="md:col-span-2" />
        <Select name="category" defaultValue={query.category}>
          <option value="">{t('search.category')}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {locale === 'zh' ? category.nameZh : category.nameEn}
            </option>
          ))}
        </Select>
        <Input name="city" placeholder={t('search.city')} defaultValue={query.city} />
        <Input name="region" placeholder={t('search.region')} defaultValue={query.region} />
        <Select name="sort" defaultValue={query.sort ?? 'latest'}>
          <option value="latest">{t('search.latest')}</option>
          <option value="price_low">{t('search.priceLow')}</option>
          <option value="price_high">{t('search.priceHigh')}</option>
        </Select>
        <Input name="minPrice" type="number" placeholder={t('search.minPrice')} defaultValue={query.minPrice} />
        <Input name="maxPrice" type="number" placeholder={t('search.maxPrice')} defaultValue={query.maxPrice} />
        <Button type="submit" className="md:col-span-2">{t('common.apply')}</Button>
      </form>

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('common.empty')}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} locale={locale} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
