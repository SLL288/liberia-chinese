'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement Supabase auth
    try {
      // Redirect to dashboard after login
      setTimeout(() => router.push('/en/dashboard'), 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-8 mb-8">
      <CardHeader>
        <CardTitle className="text-2xl">{t('auth.login')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              {t('auth.email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-liberia-red focus:outline-none"
              required
            />
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            {t('auth.send_magic_link')}
          </Button>

          <Button variant="outline" className="w-full">
            {t('auth.continue_with_google')}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">{t('auth.no_account')} </span>
            <Link href="/en/auth/signup" className="text-liberia-red font-medium hover:underline">
              {t('auth.sign_up')}
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
