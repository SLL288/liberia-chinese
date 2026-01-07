import { getTranslations } from 'next-intl/server';
import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function RulesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="container-shell space-y-8 py-10">
      <h1 className="text-3xl font-semibold text-display">{t('footer.rules')}</h1>
      <Card>
        <CardContent className="space-y-3 p-6 text-sm text-muted-foreground">
          <p>
            {locale === 'zh'
              ? '1. 禁止发布违法、欺诈、歧视或侵犯他人权益的信息。'
              : '1. Do not post illegal, fraudulent, or abusive content.'}
          </p>
          <p>
            {locale === 'zh'
              ? '2. 信息需真实有效，管理员有权下架违规内容。'
              : '2. Listings must be accurate. Admins may remove violations.'}
          </p>
          <p>
            {locale === 'zh'
              ? '3. 广告位与置顶服务需遵守平台定价与审核规则。'
              : '3. Promotion services follow the platform pricing and review policy.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
