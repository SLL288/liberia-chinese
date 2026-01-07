import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

type CategoryCardProps = {
  locale: string;
  category: {
    slug: string;
    nameZh: string;
    nameEn: string;
  };
};

export function CategoryCard({ locale, category }: CategoryCardProps) {
  return (
    <Card className="transition hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="flex h-full flex-col justify-between gap-3 p-5">
        <div className="text-lg font-semibold">
          {locale === 'zh' ? category.nameZh : category.nameEn}
        </div>
        <Link
          href={`/${locale}/categories/${category.slug}`}
          className="text-sm text-primary hover:underline"
        >
          {locale === 'zh' ? '查看分类' : 'View category'}
        </Link>
      </CardContent>
    </Card>
  );
}
