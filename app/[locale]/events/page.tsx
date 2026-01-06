import React from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container, Section, SectionTitle } from '@/components/ui/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Calendar, MapPin, Users, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function EventsPage() {
  const t = useTranslations();

  return (
    <>
      <Header />
      <Section className="bg-gradient-to-br from-liberia-red to-liberia-dark-red text-white">
        <Container>
          <SectionTitle className="text-white mb-4">{t('events.title')}</SectionTitle>
          <p className="text-red-100 text-lg max-w-2xl">
            Discover upcoming community events and celebrations
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="flex flex-col md:flex-row gap-6">
                <div className="md:w-48 h-48 flex-shrink-0 bg-gradient-to-br from-liberia-red/20 to-liberia-gold/20 rounded-lg" />
                <div className="flex-1">
                  <CardHeader>
                    <CardTitle className="text-2xl">Community Event {i}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-3">
                      <Calendar size={18} />
                      January {15 + i}, 2025 at 2:00 PM
                    </CardDescription>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin size={18} />
                      Community Center, Monrovia
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Join us for an exciting community event featuring traditional performances, cultural displays, and networking opportunities.
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Users size={16} /> 25 attending
                      </span>
                      <Link href={`/en/events/${i}`} className="text-liberia-red font-medium hover:underline inline-flex items-center gap-1">
                        View Details <ChevronRight size={16} />
                      </Link>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Footer />
    </>
  );
}
