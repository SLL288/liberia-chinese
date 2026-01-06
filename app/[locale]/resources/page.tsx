import React from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container, Section, SectionTitle } from '@/components/ui/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { FileText, BookOpen, MapPin, AlertCircle, Download } from 'lucide-react';

export default function ResourcesPage() {
  const t = useTranslations();

  const resourceCategories = [
    { icon: BookOpen, title: 'Newcomer Guides', description: 'Essential information for new arrivals' },
    { icon: FileText, title: 'Legal & Visa', description: 'Immigration and legal resources' },
    { icon: MapPin, title: 'Local Services', description: 'Directory of helpful services' },
    { icon: AlertCircle, title: 'Emergency Contacts', description: 'Important phone numbers' },
  ];

  return (
    <>
      <Header />
      <Section className="bg-gradient-to-br from-liberia-red to-liberia-dark-red text-white">
        <Container>
          <SectionTitle className="text-white mb-4">{t('resources.title')}</SectionTitle>
          <p className="text-red-100 text-lg max-w-2xl">
            Helpful resources for community members
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          {/* Resource Categories */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {resourceCategories.map((category, i) => {
              const Icon = category.icon;
              return (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="text-liberia-red" size={28} />
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                    </div>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Resource Items */}
          <SectionTitle className="mb-8">Featured Resources</SectionTitle>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Resource Title {i}</CardTitle>
                      <CardDescription className="mt-2">
                        Description of the resource and how it can help community members.
                      </CardDescription>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="#">
                        <Download size={16} className="mr-1" />
                        View
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Footer />
    </>
  );
}
