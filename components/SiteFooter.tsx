"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function SiteFooter() {
  const t = useTranslations();
  const pathname = usePathname();
  const localePrefix = pathname?.startsWith('/en') ? '/en' : '/zh';

  return (
    <footer className="border-t border-border bg-white">
      <div className="container-shell py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-display">Liberia Chinese Hub</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t('footer.description')}</p>
          </div>
          <div className="space-y-2 text-sm">
            <Link className="block text-muted-foreground hover:text-foreground" href={`${localePrefix}/rules`}>
              {t('footer.rules')}
            </Link>
            <Link className="block text-muted-foreground hover:text-foreground" href={`${localePrefix}/privacy`}>
              {t('footer.privacy')}
            </Link>
            <Link className="block text-muted-foreground hover:text-foreground" href={`${localePrefix}/contact`}>
              {t('footer.contact')}
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>{t('footer.address')}</p>
            <p>support@liberia-chinese.app</p>
          </div>
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Liberia Chinese Hub
        </p>
      </div>
    </footer>
  );
}
