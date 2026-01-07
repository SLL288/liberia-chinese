import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  let messages = {};
  try {
    console.log(`[Layout] Loading messages for locale: ${locale}`);
    messages = await getMessages();
    console.log(`[Layout] Successfully loaded messages for locale: ${locale}`);
  } catch (error) {
    console.error(`[Layout] Failed to get messages for locale ${locale}:`, error instanceof Error ? error.message : String(error));
    throw error; // Re-throw so Vercel captures the error
  }

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
