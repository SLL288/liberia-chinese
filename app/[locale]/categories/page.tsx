import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { CategoryCard } from '@/components/CategoryCard';
import { getCategories } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  type CategoryItem = Awaited<ReturnType<typeof getCategories>>[number];
  const categories: CategoryItem[] = await getCategories();

  return (
    <div className="container-shell space-y-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-display">{t('nav.categories')}</h1>
        <Link href={`/${locale}/publish`} className="text-sm text-primary hover:underline">
          {t('home.publishCTA')}
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} locale={locale} category={category} />
        ))}
      </div>
    </div>
  );
}
