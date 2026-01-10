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
  const [submitting, setSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'USD',
    categoryId: '',
    city: '',
    region: '',
  });
  const [images, setImages] = useState<{ id: string; url: string; name: string }[]>([]);
  const router = useRouter();
  const step = steps[stepIndex];

  const nextStep = () => setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  const updateField = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    const payload = {
      title: formState.title,
      description: formState.description,
      price: formState.price ? Number(formState.price) : undefined,
      currency: formState.currency,
      categoryId: formState.categoryId,
      city: formState.city,
      region: formState.region,
      imageUrls: images.map((image) => image.url),
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
    setSubmitting(false);
  };

  const handleFiles = (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        const url = typeof reader.result === 'string' ? reader.result : '';
        if (!url) return;
        setImages((prev) => [
          ...prev,
          { id: `${file.name}-${file.lastModified}`, url, name: file.name },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((image) => image.id !== id));
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
          <div
            className="md:col-span-2"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              if (event.dataTransfer.files.length) {
                handleFiles(event.dataTransfer.files);
              }
            }}
          >
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-8 text-center text-sm text-muted-foreground">
              <span>
                {locale === 'zh'
                  ? '拖拽图片到此处，或点击上传'
                  : 'Drag photos here or click to upload'}
              </span>
              <span className="mt-2 text-xs">
                {locale === 'zh' ? '图片将以本地占位形式保存。' : 'Images are stored as local placeholders.'}
              </span>
              <Input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => {
                  if (event.target.files) handleFiles(event.target.files);
                }}
              />
            </label>
            {images.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {images.map((image) => (
                  <div key={image.id} className="relative overflow-hidden rounded-xl border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.url} alt={image.name} className="h-32 w-full object-cover" />
                    <button
                      type="button"
                      className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs text-muted-foreground"
                      onClick={() => removeImage(image.id)}
                    >
                      {locale === 'zh' ? '移除' : 'Remove'}
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
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
            {locale === 'zh' ? '确认后将自动发布。' : 'Publish immediately after submission.'}
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
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (locale === 'zh' ? '提交中…' : 'Submitting...') : locale === 'zh' ? '提交发布' : 'Submit'}
          </Button>
        )}
      </div>
    </div>
  );
}
