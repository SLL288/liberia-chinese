import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatCurrency } from '@/lib/utils';

type PostCardProps = {
  locale: string;
  post: {
    id: string;
    title: string;
    titleZh?: string | null;
    titleEn?: string | null;
    price: any;
    currency: string;
    city: string | null;
    region: string | null;
    createdAt: Date;
    views: number;
    isTop: boolean;
    isFeatured: boolean;
    isUrgent: boolean;
    images?: { url: string }[];
    category?: { nameZh: string; nameEn: string; slug: string };
  };
};

export function PostCard({ locale, post }: PostCardProps) {
  const image = post.images?.[0]?.url ?? '/images/sample/house-1.svg';
  const title =
    locale === 'zh'
      ? post.titleZh || post.title
      : post.titleEn || post.title;
  const priceLabel =
    typeof post.price === 'number'
      ? formatCurrency(post.price, post.currency, locale === 'zh' ? 'zh-CN' : 'en-US')
      : post.price
      ? formatCurrency(Number(post.price), post.currency, locale === 'zh' ? 'zh-CN' : 'en-US')
      : locale === 'zh'
      ? '面议'
      : 'Negotiable';

  return (
    <Card className="overflow-hidden transition hover:shadow-md">
      <Link href={`/${locale}/posts/${post.id}`} className="block">
        <div className="h-40 w-full bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={post.title} className="h-full w-full object-cover" />
        </div>
        <CardHeader>
          <div className="flex flex-wrap gap-2">
            {post.isTop && <Badge>{locale === 'zh' ? '置顶' : 'Top'}</Badge>}
            {post.isFeatured && <Badge variant="featured">{locale === 'zh' ? '推荐' : 'Featured'}</Badge>}
            {post.isUrgent && <Badge variant="urgent">{locale === 'zh' ? '加急' : 'Urgent'}</Badge>}
          </div>
          <CardTitle className="line-clamp-2 text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>{priceLabel}</span>
            <span>{formatDate(post.createdAt, locale === 'zh' ? 'zh-CN' : 'en-US')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>
              {post.city ?? '—'} {post.region ? `· ${post.region}` : ''}
            </span>
            <span>👁️ {post.views}</span>
          </div>
          {post.category ? (
            <div className="text-xs text-muted-foreground">
              {locale === 'zh' ? post.category.nameZh : post.category.nameEn}
            </div>
          ) : null}
        </CardContent>
      </Link>
    </Card>
  );
}
