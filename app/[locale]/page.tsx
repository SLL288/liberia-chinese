import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Container, Section, SectionTitle } from '@/components/ui/Layout';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChevronRight, Calendar, Users, Newspaper, Award } from 'lucide-react';

export default function HomePage() {
  const t = useTranslations();

  return (
    <>
      <Header />

      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-liberia-red to-liberia-dark-red text-white py-20 md:py-32">
        <Container>
          <div className="space-y-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              {t('home.title')}
            </h1>
            <p className="text-lg md:text-xl text-red-100 max-w-2xl mx-auto">
              {t('home.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="secondary" size="lg" asChild className="hover:bg-white">
                <Link href="/en/membership">{t('home.hero_cta')}</Link>
              </Button>
              <Button variant="gold" size="lg" asChild>
                <Link href="/en/donate">{t('home.hero_donate')}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Mission Section */}
      <Section>
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTitle className="mb-4">{t('home.mission_title')}</SectionTitle>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t('home.mission_description')}
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-liberia-red flex items-center justify-center flex-shrink-0">
                    <Users className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Community Building</h3>
                    <p className="text-sm text-gray-600">Strengthening cultural ties and social connections</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-liberia-gold flex items-center justify-center flex-shrink-0">
                    <Award className="text-liberia-navy" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Cultural Promotion</h3>
                    <p className="text-sm text-gray-600">Celebrating Chinese heritage and traditions</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="aspect-video rounded-lg bg-gradient-to-br from-liberia-red/10 to-liberia-gold/10 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-liberia-red mb-2">500+</h3>
                <p className="text-gray-600">Active Members</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Latest News */}
      <Section className="bg-gray-50">
        <Container>
          <SectionTitle className="mb-12 text-center">{t('home.latest_news')}</SectionTitle>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <div className="h-40 bg-gradient-to-br from-liberia-red/20 to-liberia-gold/20 rounded-lg mb-4" />
                <CardHeader>
                  <CardTitle className="text-lg">News Article {i}</CardTitle>
                  <CardDescription>January {6 + i}, 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    Discover our latest updates and announcements from the Liberian Chinese Society.
                  </p>
                  <Link href="#" className="text-liberia-red text-sm font-medium hover:underline inline-flex items-center gap-1">
                    {t('common.readMore')} <ChevronRight size={16} />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button variant="outline" asChild>
              <Link href="/en/news">{t('home.latest_news')}</Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Upcoming Events */}
      <Section>
        <Container>
          <SectionTitle className="mb-12 text-center">{t('home.upcoming_events')}</SectionTitle>
          <div className="space-y-4 mb-8">
            {[1, 2].map((i) => (
              <Card key={i} className="flex flex-col md:flex-row gap-4">
                <div className="md:w-32 h-32 flex-shrink-0 bg-gradient-to-br from-liberia-red/20 to-liberia-gold/20 rounded-lg" />
                <div className="flex-1">
                  <CardHeader>
                    <CardTitle className="text-lg">Community Event {i}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Calendar size={16} />
                      January {15 + i}, 2025 at 2:00 PM
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Join us for an exciting event celebrating our community and promoting Chinese culture.
                    </p>
                  </CardContent>
                </div>
                <div className="flex items-center md:items-end">
                  <Button variant="outline" asChild>
                    <Link href={`/en/events/${i}`}>View Details</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button asChild>
              <Link href="/en/events">{t('home.view_all_events')}</Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-liberia-red/5 border-y border-liberia-red/10">
        <Container>
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to join our community?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Become a member and get access to exclusive events, networking opportunities, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link href="/en/membership">Join Now</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/en/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </>
  );
}
