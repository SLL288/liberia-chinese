import React from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container, Section, SectionTitle } from '@/components/ui/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function NewsPage() {
  const t = useTranslations();

  return (
    <>
      <Header />
      <Section className="bg-gradient-to-br from-liberia-red to-liberia-dark-red text-white">
        <Container>
          <SectionTitle className="text-white mb-4">{t('news.title')}</SectionTitle>
          <p className="text-red-100 text-lg max-w-2xl">
            Stay updated with latest announcements and community news
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <div className="h-48 bg-gradient-to-br from-liberia-red/20 to-liberia-gold/20 rounded-t-lg mb-4" />
                <CardHeader>
                  <CardTitle className="text-lg">News Article {i}</CardTitle>
                  <CardDescription>January {6 + i}, 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                    Discover the latest updates from Liberian Chinese Society including community events, cultural celebrations, and important announcements.
                  </p>
                  <Link href={`/en/news/article-${i}`} className="text-liberia-red font-medium hover:underline inline-flex items-center gap-1">
                    {t('common.readMore')} <ChevronRight size={16} />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Footer />
    </>
  );
}
