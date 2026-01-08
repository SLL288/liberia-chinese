import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getUserPosts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PromotionTable } from '@/components/PromotionTable';
import { formatDate } from '@/lib/utils';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="container-shell py-16">
        <h1 className="text-2xl font-semibold">{t('dashboard.title')}</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {locale === 'zh' ? '请先登录查看发布内容。' : 'Sign in to manage your posts.'}
        </p>
        <Button asChild className="mt-6">
          <Link href={`/${locale}/login`}>{t('nav.login')}</Link>
        </Button>
      </div>
    );
  }

  type UserPost = Awaited<ReturnType<typeof getUserPosts>>[number];
  const posts: UserPost[] = await getUserPosts(user.id);

  return (
    <div className="container-shell space-y-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-display">{t('dashboard.title')}</h1>
        <Button asChild>
          <Link href={`/${locale}/publish`}>{t('home.publishCTA')}</Link>
        </Button>
      </div>
      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('common.empty')}</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(post.createdAt, locale === 'zh' ? 'zh-CN' : 'en-US')} ·{' '}
                    {locale === 'zh' ? post.category.nameZh : post.category.nameEn}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs">{post.status}</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/${locale}/posts/${post.id}`}>{t('common.edit')}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <PromotionTable locale={locale} />
    </div>
  );
}
