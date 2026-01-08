"use client";

import { Suspense, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function LoginForm() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = pathname?.startsWith('/en') ? 'en' : 'zh';
  const callbackUrl = searchParams.get('callbackUrl') ?? `/${locale}`;
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleDevLogin = async () => {
    await signIn('credentials', { email, name, callbackUrl });
  };

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-border bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-display">{t('nav.login')}</h1>
      <p className="text-sm text-muted-foreground">{t('auth.hint')}</p>
      <div className="space-y-3">
        <Input
          placeholder={t('common.name')}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Input
          type="email"
          placeholder={t('common.email')}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <Button className="w-full" onClick={handleDevLogin}>
        {t('nav.login')}
      </Button>
      <p className="text-xs text-muted-foreground">
        {process.env.NEXT_PUBLIC_EMAIL_HINT ??
          (t('nav.login') === '登录'
            ? '当前启用本地登录模式；配置邮箱服务后可启用魔法链接。'
            : 'Dev login is enabled. Configure an email provider to use magic links.')}
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="container-shell py-16">
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
