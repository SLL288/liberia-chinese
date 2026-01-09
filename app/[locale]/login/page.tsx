"use client";

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Step = 'phone' | 'verify' | 'emailSent';
type Method = 'phone' | 'email';

const RESEND_SECONDS = 60;

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const t = useTranslations();
  const [step, setStep] = useState<Step>('phone');
  const [method, setMethod] = useState<Method>('phone');
  const [phone, setPhone] = useState('+231');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const pathname = usePathname();
  const locale = pathname?.startsWith('/en') ? 'en' : 'zh';

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
      return null;
    }
    return createBrowserClient(url, anonKey);
  }, []);

  useEffect(() => {
    if (!seconds) return;
    const timer = setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const sendOtp = async () => {
    setLoading(true);
    setMessage(null);
    if (!supabase) {
      setLoading(false);
      setMessage(t('auth.missingEnv'));
      return;
    }
    const origin = window.location.origin;
    const { error } =
      method === 'email'
        ? await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: `${origin}/auth/callback` },
          })
        : await supabase.auth.signInWithOtp({
            phone,
            options: { channel: 'sms' },
          });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setStep(method === 'email' ? 'emailSent' : 'verify');
    setSeconds(RESEND_SECONDS);
  };

  const verifyOtp = async () => {
    setLoading(true);
    setMessage(null);
    if (!supabase) {
      setLoading(false);
      setMessage(t('auth.missingEnv'));
      return;
    }
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    if (data.session) {
      await fetch('/api/auth/sync', { method: 'POST' });
      window.location.href = `/${locale}`;
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setMessage(null);
    if (!supabase) {
      setLoading(false);
      setMessage(t('auth.missingEnv'));
      return;
    }
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${origin}/auth/callback` },
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="container-shell py-16">
      <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-display">{t('nav.login')}</h1>
        <p className="text-sm text-muted-foreground">{t('auth.hint')}</p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={method === 'phone' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => {
              setMethod('phone');
              setStep('phone');
              setMessage(null);
            }}
          >
            {t('auth.methodPhone')}
          </Button>
          <Button
            type="button"
            variant={method === 'email' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => {
              setMethod('email');
              setStep('phone');
              setMessage(null);
            }}
          >
            {t('auth.methodEmail')}
          </Button>
        </div>

        {step === 'phone' && method === 'phone' ? (
          <div className="space-y-3">
            <Input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={t('auth.phonePlaceholder')}
            />
            <Button className="w-full" onClick={sendOtp} disabled={loading}>
              {loading ? t('common.loading') : t('auth.sendCode')}
            </Button>
          </div>
        ) : step === 'phone' && method === 'email' ? (
          <div className="space-y-3">
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t('auth.emailPlaceholder')}
            />
            <Button className="w-full" onClick={sendOtp} disabled={loading}>
              {loading ? t('common.loading') : t('auth.sendEmail')}
            </Button>
          </div>
        ) : step === 'verify' ? (
          <div className="space-y-3">
            <Input
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder={t('auth.otpPlaceholder')}
            />
            <Button className="w-full" onClick={verifyOtp} disabled={loading}>
              {loading ? t('common.loading') : t('auth.verifyCode')}
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={sendOtp}
              disabled={loading || seconds > 0}
            >
              {seconds > 0 ? t('auth.resendIn', { seconds }) : t('auth.resend')}
            </Button>
          </div>
        ) : (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>{t('auth.emailSent')}</p>
            <Button
              variant="ghost"
              className="w-full"
              onClick={sendOtp}
              disabled={loading || seconds > 0}
            >
              {seconds > 0 ? t('auth.resendIn', { seconds }) : t('auth.resend')}
            </Button>
          </div>
        )}

        {process.env.NEXT_PUBLIC_ENABLE_GOOGLE === 'true' ? (
          <Button variant="outline" className="w-full" onClick={signInWithGoogle} disabled={loading}>
            {t('auth.continueWithGoogle')}
          </Button>
        ) : null}

        {message ? <p className="text-sm text-red-600">{message}</p> : null}
      </div>
    </div>
  );
}
