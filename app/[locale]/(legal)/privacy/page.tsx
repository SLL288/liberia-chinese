import { getTranslations } from 'next-intl/server';
import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="container-shell space-y-8 py-10">
      <h1 className="text-3xl font-semibold text-display">{t('footer.privacy')}</h1>
      <Card>
        <CardContent className="space-y-3 p-6 text-sm text-muted-foreground">
          <p>
            {locale === 'zh'
              ? '我们只收集提供服务所需的最少信息，包括邮箱、发布内容与联系信息。'
              : 'We only collect the minimum data needed to provide the service, including email and listing details.'}
          </p>
          <p>
            {locale === 'zh'
              ? '平台不会向第三方出售用户信息。'
              : 'We do not sell user data to third parties.'}
          </p>
          <p>
            {locale === 'zh'
              ? '如需删除账户或数据，请联系我们。'
              : 'Contact us for account or data deletion requests.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
