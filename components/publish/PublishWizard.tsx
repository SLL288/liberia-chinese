"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type PublishWizardProps = {
  locale: string;
  categories: { id: string; nameZh: string; nameEn: string }[];
};

const steps = ['details', 'contact', 'review'] as const;

export function PublishWizard({ locale, categories }: PublishWizardProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'USD',
    categoryId: '',
    city: '',
    region: '',
    imageUrls: '',
  });
  const router = useRouter();
  const step = steps[stepIndex];

  const nextStep = () => setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  const updateField = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      title: formState.title,
      description: formState.description,
      price: formState.price ? Number(formState.price) : undefined,
      currency: formState.currency,
      categoryId: formState.categoryId,
      city: formState.city,
      region: formState.region,
      imageUrls: formState.imageUrls
        ? formState.imageUrls.split(',').map((url) => url.trim())
        : [],
    };

    const response = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      router.push(`/${locale}/posts/${data.id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className={step === 'details' ? 'text-primary' : ''}>
          {locale === 'zh' ? '1. 基本信息' : '1. Details'}
        </span>
        <span>→</span>
        <span className={step === 'contact' ? 'text-primary' : ''}>
          {locale === 'zh' ? '2. 联系方式' : '2. Contact'}
        </span>
        <span>→</span>
        <span className={step === 'review' ? 'text-primary' : ''}>
          {locale === 'zh' ? '3. 确认发布' : '3. Review'}
        </span>
      </div>

      {step === 'details' && (
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            placeholder={locale === 'zh' ? '标题' : 'Title'}
            value={formState.title}
            onChange={(e) => updateField('title', e.target.value)}
          />
          <Select
            value={formState.categoryId}
            onChange={(e) => updateField('categoryId', e.target.value)}
          >
            <option value="">{locale === 'zh' ? '选择分类' : 'Select category'}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {locale === 'zh' ? category.nameZh : category.nameEn}
              </option>
            ))}
          </Select>
          <Input
            placeholder={locale === 'zh' ? '价格（可选）' : 'Price (optional)'}
            value={formState.price}
            onChange={(e) => updateField('price', e.target.value)}
            type="number"
          />
          <Input
            placeholder={locale === 'zh' ? '城市' : 'City'}
            value={formState.city}
            onChange={(e) => updateField('city', e.target.value)}
          />
          <Input
            placeholder={locale === 'zh' ? '区域' : 'Region'}
            value={formState.region}
            onChange={(e) => updateField('region', e.target.value)}
          />
          <Textarea
            placeholder={locale === 'zh' ? '详细描述' : 'Describe your listing'}
            value={formState.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="md:col-span-2"
          />
          <Input
            placeholder={locale === 'zh' ? '图片链接（逗号分隔）' : 'Image URLs (comma separated)'}
            value={formState.imageUrls}
            onChange={(e) => updateField('imageUrls', e.target.value)}
            className="md:col-span-2"
          />
        </div>
      )}

      {step === 'contact' && (
        <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          {locale === 'zh'
            ? '联系人信息使用你的账户资料（微信/WhatsApp/电话）。请在个人中心完善。'
            : 'Contact info will use your profile details. Update them in your account.'}
        </div>
      )}

      {step === 'review' && (
        <div className="rounded-2xl border border-border bg-white p-6">
          <h3 className="text-lg font-semibold">{formState.title || '...'}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{formState.description || '...'}</p>
          <div className="mt-4 text-sm text-muted-foreground">
            {locale === 'zh' ? '确认后信息将进入审核队列。' : 'Submit to moderation queue.'}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {stepIndex > 0 && (
          <Button variant="outline" onClick={prevStep}>
            {locale === 'zh' ? '返回' : 'Back'}
          </Button>
        )}
        {stepIndex < steps.length - 1 ? (
          <Button onClick={nextStep}>{locale === 'zh' ? '下一步' : 'Next'}</Button>
        ) : (
          <Button onClick={handleSubmit}>{locale === 'zh' ? '提交发布' : 'Submit'}</Button>
        )}
      </div>
    </div>
  );
}
