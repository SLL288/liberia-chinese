import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n';
import '../../app/globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://liberia-chinese.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'Liberian Chinese Society',
    template: '%s - Liberian Chinese Society',
  },
  description: 'Promoting Chinese culture, community support, and business networking in Liberia',
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Liberian Chinese Society',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
