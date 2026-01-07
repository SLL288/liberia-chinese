import { getTranslations } from 'next-intl/server';
import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="container-shell space-y-8 py-10">
      <div>
        <h1 className="text-3xl font-semibold text-display">{t('footer.contact')}</h1>
        <p className="text-sm text-muted-foreground">
          {locale === 'zh'
            ? '如需合作、广告投放或问题反馈，请联系我们。'
            : 'For partnerships, ads, or support, reach out to us.'}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="space-y-2 p-6">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-lg font-semibold">support@liberia-chinese.app</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-6">
            <p className="text-sm text-muted-foreground">WhatsApp</p>
            <p className="text-lg font-semibold">+231 77 000 0000</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-6">
            <p className="text-sm text-muted-foreground">{t('common.city')}</p>
            <p className="text-lg font-semibold">Monrovia</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
