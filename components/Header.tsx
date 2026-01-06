'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Layout';

export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const locale = pathname.split('/')[1];
  const otherLocale = locale === 'en' ? 'zh' : 'en';
  const pathWithoutLocale = pathname.replace(`/${locale}`, '');
  const newPathname = `/${otherLocale}${pathWithoutLocale}`;

  const toggleLanguage = () => {
    router.push(newPathname);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between py-4">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-liberia-red flex items-center justify-center text-white font-bold text-lg">
              LCS
            </div>
            <span className="hidden font-bold text-liberia-red sm:inline-block">
              Liberian Chinese
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href={`/${locale}`} className="text-sm font-medium text-gray-700 hover:text-liberia-red transition-colors">
              {t('nav.home')}
            </Link>
            <Link href={`/${locale}/about`} className="text-sm font-medium text-gray-700 hover:text-liberia-red transition-colors">
              {t('nav.about')}
            </Link>
            <Link href={`/${locale}/events`} className="text-sm font-medium text-gray-700 hover:text-liberia-red transition-colors">
              {t('nav.events')}
            </Link>
            <Link href={`/${locale}/news`} className="text-sm font-medium text-gray-700 hover:text-liberia-red transition-colors">
              {t('nav.news')}
            </Link>
            <Link href={`/${locale}/directory`} className="text-sm font-medium text-gray-700 hover:text-liberia-red transition-colors">
              {t('nav.directory')}
            </Link>
            <Link href={`/${locale}/resources`} className="text-sm font-medium text-gray-700 hover:text-liberia-red transition-colors">
              {t('nav.resources')}
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              title="Switch language"
            >
              {otherLocale === 'zh' ? '中文' : 'EN'}
            </button>

            {/* CTA Buttons */}
            <div className="hidden gap-2 sm:flex">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/${locale}/membership`}>
                  {t('nav.join')}
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={`/${locale}/donate`}>
                  {t('nav.donate')}
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col gap-3">
              <Link href={`/${locale}`} className="text-sm font-medium text-gray-700 hover:text-liberia-red transition-colors">
                {t('nav.home')}
              </Link>
              <Link href={`/${locale}/about`} className="text-sm font-medium text-gray-700 hover:text-liberia-red transition-colors">
                {t('nav.about')}
              </Link>
              <Link href={`/${locale}/events`} className="text-sm font-medium text-gray-700 hover:text-liberia-red transition-colors">
                {t('nav.events')}
              </Link>
              <Link href={`/${locale}/news`} className="text-sm font-medium text-gray-700 hover:text-liberia-red transition-colors">
                {t('nav.news')}
              </Link>
              <Link href={`/${locale}/directory`} className="text-sm font-medium text-gray-700 hover:text-liberia-red transition-colors">
                {t('nav.directory')}
              </Link>
              <Link href={`/${locale}/resources`} className="text-sm font-medium text-gray-700 hover:text-liberia-red transition-colors">
                {t('nav.resources')}
              </Link>
              <div className="pt-3 flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/${locale}/membership`}>
                    {t('nav.join')}
                  </Link>
                </Button>
                <Button size="sm" asChild className="flex-1">
                  <Link href={`/${locale}/donate`}>
                    {t('nav.donate')}
                  </Link>
                </Button>
              </div>
            </div>
          </nav>
        )}
      </Container>
    </header>
  );
}
