import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getCategories } from '@/lib/data';
import { PublishWizard } from '@/components/publish/PublishWizard';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function PublishPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  const user = await getCurrentUser();
  const categories = await getCategories();

  return (
    <div className="container-shell space-y-8 py-10">
      <div>
        <h1 className="text-3xl font-semibold text-display">{t('publish.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('publish.hint')}</p>
      </div>
      {!user ? (
        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="text-sm text-muted-foreground">
            {locale === 'zh'
              ? '发布信息前请先登录。'
              : 'Please sign in before publishing a post.'}
          </p>
          <Button asChild className="mt-4">
            <Link href={`/${locale}/login`}>{t('nav.login')}</Link>
          </Button>
        </div>
      ) : (
        <PublishWizard locale={locale} categories={categories} />
      )}
    </div>
  );
}
