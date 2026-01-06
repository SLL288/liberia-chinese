'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Layout';
import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <Container>
        <div className="py-12">
          {/* Main Footer Content */}
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            {/* About Section */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {t('footer.about_us')}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('home.mission_description')}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {t('footer.quick_links')}
              </h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-gray-600 hover:text-liberia-red transition-colors">{t('nav.events')}</Link></li>
                <li><Link href="#" className="text-sm text-gray-600 hover:text-liberia-red transition-colors">{t('nav.news')}</Link></li>
                <li><Link href="#" className="text-sm text-gray-600 hover:text-liberia-red transition-colors">{t('nav.directory')}</Link></li>
                <li><Link href="#" className="text-sm text-gray-600 hover:text-liberia-red transition-colors">{t('nav.membership')}</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {t('footer.contact_us')}
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <Phone size={16} className="mt-0.5 flex-shrink-0" />
                  <span>+231 XX XXX XXXX</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <Mail size={16} className="mt-0.5 flex-shrink-0" />
                  <a href="mailto:info@liberiachinese.com" className="hover:text-liberia-red">
                    info@liberiachinese.com
                  </a>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                  <span>Monrovia, Liberia</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {t('footer.newsletter')}
              </h3>
              <form className="space-y-2">
                <input
                  type="email"
                  placeholder={t('footer.email_placeholder')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-liberia-red focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-liberia-red px-3 py-2 text-sm font-medium text-white hover:bg-liberia-dark-red transition-colors"
                >
                  {t('footer.subscribe')}
                </button>
              </form>
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t border-gray-200 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h4 className="text-sm font-semibold text-foreground">
                  {t('footer.follow_us')}
                </h4>
                <div className="flex gap-4">
                  <a href="#" className="text-gray-600 hover:text-liberia-red transition-colors">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-liberia-red transition-colors">
                    <Linkedin size={20} />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-liberia-red transition-colors">
                    <Instagram size={20} />
                  </a>
                </div>
              </div>

              {/* Footer Links */}
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="#" className="text-gray-600 hover:text-liberia-red transition-colors">
                  {t('footer.privacy_policy')}
                </Link>
                <span className="text-gray-300">•</span>
                <Link href="#" className="text-gray-600 hover:text-liberia-red transition-colors">
                  {t('footer.terms_of_service')}
                </Link>
                <span className="text-gray-300">•</span>
                <Link href="#" className="text-gray-600 hover:text-liberia-red transition-colors">
                  {t('footer.code_of_conduct')}
                </Link>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            {t('footer.copyright')}
          </div>
        </div>
      </Container>
    </footer>
  );
}
