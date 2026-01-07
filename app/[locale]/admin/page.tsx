import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  const session = await auth();

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return (
      <div className="container-shell py-16">
        <h1 className="text-2xl font-semibold">{t('admin.title')}</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {locale === 'zh' ? '该页面仅管理员可访问。' : 'Admin access required.'}
        </p>
      </div>
    );
  }

  const [postCount, pendingCount, reportCount, bannerCount] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: 'PENDING' } }),
    prisma.report.count({ where: { status: 'PENDING' } }),
    prisma.banner.count(),
  ]);

  return (
    <div className="container-shell space-y-8 py-10">
      <h1 className="text-3xl font-semibold text-display">{t('admin.title')}</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="space-y-2 p-6">
            <p className="text-sm text-muted-foreground">Posts</p>
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
            <p className="text-sm text-muted-foreground">Reports</p>
            <p className="text-2xl font-semibold">{reportCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-6">
            <p className="text-sm text-muted-foreground">{t('admin.banners')}</p>
            <p className="text-2xl font-semibold">{bannerCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
