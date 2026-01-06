import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { en } from '@/content/en';
import { zh } from '@/content/zh';

export const locales = ['zh', 'en'] as const;
export const defaultLocale = 'zh' as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  const messages = locale === 'zh' ? zh : en;

  return {
    messages,
  };
});
