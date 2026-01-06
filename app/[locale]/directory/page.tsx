import React from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container, Section, SectionTitle } from '@/components/ui/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Phone, Mail, Globe, MessageCircle } from 'lucide-react';

export default function DirectoryPage() {
  const t = useTranslations();

  return (
    <>
      <Header />
      <Section className="bg-gradient-to-br from-liberia-red to-liberia-dark-red text-white">
        <Container>
          <SectionTitle className="text-white mb-4">{t('directory.title')}</SectionTitle>
          <p className="text-red-100 text-lg max-w-2xl">
            Discover local businesses and connect with community members
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <input
              type="text"
              placeholder={t('directory.search_placeholder')}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              {['All', 'Restaurant', 'Services', 'Retail'].map((category) => (
                <button
                  key={category}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:border-liberia-red hover:text-liberia-red transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Listings */}
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span>Business Name {i}</span>
                    {i % 2 === 0 && <span className="text-xs bg-liberia-gold text-liberia-navy px-2 py-1 rounded">Featured</span>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} />
                      <span>+231 XX XXX XXXX</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={16} />
                      <span>contact@business.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe size={16} />
                      <span>www.business.com</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    Professional business offering quality services to the community.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" asChild>
                      <Link href="#">
                        <Phone size={16} className="mr-1" />
                        Call
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" asChild>
                      <Link href="#">
                        <MessageCircle size={16} className="mr-1" />
                        WeChat
                      </Link>
                    </Button>
                  </div>
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
