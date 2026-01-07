import { getPricingPlans } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

type PromotionTableProps = {
  locale: string;
};

export async function PromotionTable({ locale }: PromotionTableProps) {
  const plans = await getPricingPlans();
  if (plans.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="space-y-3 p-6">
        <h3 className="text-lg font-semibold">
          {locale === 'zh' ? '推广套餐' : 'Promotion Plans'}
        </h3>
        <div className="grid gap-3 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-xl border border-border bg-white p-4 text-sm">
              <p className="font-semibold">
                {plan.product === 'TOP'
                  ? locale === 'zh'
                    ? '置顶'
                    : 'Top'
                  : plan.product === 'FEATURED'
                  ? locale === 'zh'
                    ? '推荐'
                    : 'Featured'
                  : locale === 'zh'
                  ? '加急'
                  : 'Urgent'}
              </p>
              <p className="mt-2 text-xl font-semibold">
                {formatCurrency(
                  Number(plan.price),
                  plan.currency,
                  locale === 'zh' ? 'zh-CN' : 'en-US'
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {locale === 'zh' ? `${plan.durationDays} 天展示` : `${plan.durationDays} days`}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
