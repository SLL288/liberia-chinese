import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['zh', 'en'] as const;
export const defaultLocale = 'zh' as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = locale === 'zh' 
    ? (await import('./content/zh')).default
    : (await import('./content/en')).default;

  return {
    messages,
  };
});
