import React from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container, Section, SectionTitle } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations();

  return (
    <>
      <Header />
      <Section className="bg-gradient-to-br from-liberia-red to-liberia-dark-red text-white">
        <Container>
          <SectionTitle className="text-white mb-4">{t('contact.title')}</SectionTitle>
          <p className="text-red-100 text-lg max-w-2xl">
            Get in touch with us. We'd love to hear from you.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Email */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-liberia-red/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="text-liberia-red" size={32} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t('contact.email')}</h3>
              <a href="mailto:info@liberiachinese.com" className="text-liberia-red hover:underline">
                info@liberiachinese.com
              </a>
            </div>

            {/* Phone */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-liberia-gold/20 flex items-center justify-center mx-auto mb-4">
                <Phone className="text-liberia-red" size={32} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t('contact.phone')}</h3>
              <a href="tel:+231XXXXXXXXX" className="text-liberia-red hover:underline">
                +231 XX XXX XXXX
              </a>
            </div>

            {/* Address */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-liberia-red/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-liberia-red" size={32} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t('contact.address')}</h3>
              <p className="text-gray-600">Monrovia, Liberia</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold mb-6">{t('contact.get_in_touch')}</h2>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="rounded-lg border border-gray-300 px-4 py-2 focus:border-liberia-red focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="rounded-lg border border-gray-300 px-4 py-2 focus:border-liberia-red focus:outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-liberia-red focus:outline-none"
              />
              <textarea
                placeholder={t('contact.message_placeholder')}
                rows={5}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-liberia-red focus:outline-none"
              />
              <Button className="w-full">{t('contact.send_message')}</Button>
            </form>
          </div>

          {/* Social and Additional Contact */}
          <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-gray-200">
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t('contact.wechat_official')}</h3>
              <p className="text-gray-600 mb-4">
                Follow our official WeChat account for updates and announcements.
              </p>
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">QR Code</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">{t('contact.whatsapp')}</h3>
              <p className="text-gray-600 mb-4">
                Message us on WhatsApp for quick responses.
              </p>
              <Button variant="outline" asChild>
                <a href="https://wa.me/231XXXXXXXXX" target="_blank" rel="noopener noreferrer">
                  <MessageSquare size={16} className="mr-2" />
                  Open WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </>
  );
}
