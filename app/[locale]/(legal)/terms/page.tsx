import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="container-shell space-y-8 py-10">
      <h1 className="text-3xl font-semibold text-display">{locale === 'zh' ? '服务条款' : 'Terms of Service'}</h1>
      <Card>
        <CardContent className="space-y-3 p-6 text-sm text-muted-foreground">
          <p>
            {locale === 'zh'
              ? '使用本平台即表示您同意遵守社区规则与内容审核机制。'
              : 'By using this platform, you agree to the community rules and moderation process.'}
          </p>
          <p>
            {locale === 'zh'
              ? '平台保留对违规信息进行下架、封禁的权利。'
              : 'We reserve the right to remove or ban content that violates policies.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
