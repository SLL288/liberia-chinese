import React from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container, Section, SectionTitle } from '@/components/ui/Layout';
import Link from 'next/link';

export default function GalleryPage() {
  const t = useTranslations();

  return (
    <>
      <Header />
      <Section className="bg-gradient-to-br from-liberia-red to-liberia-dark-red text-white">
        <Container>
          <SectionTitle className="text-white mb-4">{t('gallery.title')}</SectionTitle>
          <p className="text-red-100 text-lg max-w-2xl">
            View photos and videos from our community events
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          {/* Gallery Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div
                key={i}
                className="group aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-liberia-red/20 to-liberia-gold/20 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">Image {i}</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Footer />
    </>
  );
}
