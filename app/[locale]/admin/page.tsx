import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export const dynamic = 'force-dynamic';

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string; category?: string; keyword?: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();
  const admin = await requireAdmin();
  const postStatusLabel = (value: string) => {
    if (locale === 'zh') {
      if (value === 'PENDING') return '待审核';
      if (value === 'ACTIVE') return '已发布';
      if (value === 'BANNED') return '已封禁';
      if (value === 'EXPIRED') return '已过期';
      return value;
    }
    if (value === 'PENDING') return 'Pending';
    if (value === 'ACTIVE') return 'Active';
    if (value === 'BANNED') return 'Banned';
    if (value === 'EXPIRED') return 'Expired';
    return value;
  };

  if (!admin) {
    return (
      <div className="container-shell py-16">
        <h1 className="text-2xl font-semibold">{t('admin.title')}</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {locale === 'zh' ? '该页面仅管理员可访问。' : 'Admin access required.'}
        </p>
      </div>
    );
  }

  const query = await searchParams;
  const categories = await prisma.category.findMany({ orderBy: { nameZh: 'asc' } });
  const posts = await prisma.post.findMany({
    where: {
      ...(query.status ? { status: query.status } : {}),
      ...(query.category ? { categoryId: query.category } : {}),
      ...(query.keyword
        ? { OR: [{ title: { contains: query.keyword } }, { description: { contains: query.keyword } }] }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    include: { category: true, user: true },
    take: 50,
  });

  const [postCount, pendingCount, reportCount, bannerCount, newsCount] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: 'PENDING' } }),
    prisma.report.count({ where: { status: 'PENDING' } }),
    prisma.banner.count(),
    prisma.newsItem.count(),
  ]);

  return (
    <div className="container-shell space-y-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-display">{t('admin.title')}</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/logout">{locale === 'zh' ? '退出登录' : 'Sign out'}</Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="space-y-2 p-6">
            <p className="text-sm text-muted-foreground">{t('admin.posts')}</p>
            <p className="text-2xl font-semibold">{postCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-6">
            <p className="text-sm text-muted-foreground">{t('admin.moderation')}</p>
            <p className="text-2xl font-semibold">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-6">
            <p className="text-sm text-muted-foreground">{t('admin.reports')}</p>
            <p className="text-2xl font-semibold">{reportCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-6">
            <p className="text-sm text-muted-foreground">{t('admin.banners')}</p>
            <p className="text-2xl font-semibold">{bannerCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-6">
            <p className="text-sm text-muted-foreground">{t('admin.news')}</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-semibold">{newsCount}</p>
              <Link href={`/${locale}/admin/news`} className="text-sm text-primary">
                {t('news.adminEdit')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">{t('admin.moderation')}</h2>
          <form className="grid gap-3 md:grid-cols-4">
            <Input name="keyword" placeholder={locale === 'zh' ? '关键词' : 'Keyword'} defaultValue={query.keyword} />
            <Select name="status" defaultValue={query.status ?? ''}>
              <option value="">{locale === 'zh' ? '全部状态' : 'All Status'}</option>
              <option value="PENDING">{locale === 'zh' ? '待审核' : 'Pending'}</option>
              <option value="ACTIVE">{locale === 'zh' ? '已发布' : 'Active'}</option>
              <option value="BANNED">{locale === 'zh' ? '已封禁' : 'Banned'}</option>
              <option value="EXPIRED">{locale === 'zh' ? '已过期' : 'Expired'}</option>
            </Select>
            <Select name="category" defaultValue={query.category ?? ''}>
              <option value="">{locale === 'zh' ? '全部分类' : 'All Categories'}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {locale === 'zh' ? category.nameZh : category.nameEn}
                </option>
              ))}
            </Select>
            <Button type="submit">{locale === 'zh' ? '筛选' : 'Filter'}</Button>
          </form>

          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="rounded-xl border border-border bg-white p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {postStatusLabel(post.status)} · {locale === 'zh' ? post.category.nameZh : post.category.nameEn}
                    </p>
                  </div>
                  <form action="/api/admin/posts" method="post" className="flex flex-wrap gap-2">
                    <input type="hidden" name="postId" value={post.id} />
                    <Button name="action" value="approve" size="sm">
                      {locale === 'zh' ? '通过' : 'Approve'}
                    </Button>
                    <Button name="action" value="ban" size="sm" variant="destructive">
                      {locale === 'zh' ? '封禁' : 'Ban'}
                    </Button>
                    <Button
                      name="action"
                      value={post.status === 'ACTIVE' ? 'hide' : 'show'}
                      size="sm"
                      variant="outline"
                    >
                      {post.status === 'ACTIVE'
                        ? locale === 'zh'
                          ? '隐藏'
                          : 'Hide'
                        : locale === 'zh'
                        ? '显示'
                        : 'Show'}
                    </Button>
                    <Button name="action" value="feature" size="sm" variant="outline">
                      {locale === 'zh' ? '推荐' : 'Feature'}
                    </Button>
                    <Button name="action" value="top" size="sm" variant="outline">
                      {locale === 'zh' ? '置顶' : 'Top'}
                    </Button>
                    <Button name="action" value="delete" size="sm" variant="ghost">
                      {t('common.delete')}
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
