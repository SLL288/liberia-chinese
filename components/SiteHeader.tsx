"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/categories', labelKey: 'nav.categories' },
  { href: '/search', labelKey: 'nav.search' },
  { href: '/business', labelKey: 'nav.business' },
  { href: '/publish', labelKey: 'nav.publish' },
  { href: '/dashboard', labelKey: 'nav.dashboard' },
];

export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const localePrefix = pathname?.startsWith('/en') ? '/en' : '/zh';
  const altLocale = localePrefix === '/en' ? '/zh' : '/en';
  const switchPath = pathname ? pathname.replace(localePrefix, altLocale) : altLocale;

  return (
    <header className="border-b border-border bg-white/70 backdrop-blur">
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`${localePrefix}`} className="text-lg font-semibold text-display">
            利比里亚华人社区
          </Link>
          <span className="hidden text-sm text-muted-foreground md:inline">
            {t('tagline')}
          </span>
        </div>
        <nav className="hidden items-center gap-4 text-sm md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`${localePrefix}${item.href}`}
              className="text-foreground/80 hover:text-foreground"
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href={switchPath} className="text-sm text-muted-foreground hover:text-foreground">
            {localePrefix === '/en' ? '中文' : 'EN'}
          </Link>
          <Button asChild size="sm">
            <Link href={`${localePrefix}/login`}>{t('nav.login')}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
