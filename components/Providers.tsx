"use client";

import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import type { Session } from 'next-auth';

type ProvidersProps = {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, any>;
  session: Session | null;
};

export function Providers({ children, locale, messages, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
