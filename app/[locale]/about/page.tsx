import React from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container, Section, SectionTitle } from '@/components/ui/Layout';

export default function AboutPage() {
  const t = useTranslations();

  return (
    <>
      <Header />
      <Section className="bg-gradient-to-br from-liberia-red to-liberia-dark-red text-white">
        <Container>
          <SectionTitle className="text-white mb-4">{t('about.title')}</SectionTitle>
          <p className="text-red-100 text-lg max-w-2xl">
            Learn more about our organization's mission, history, and leadership.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="space-y-12">
            {/* Mission */}
            <div>
              <h2 className="text-3xl font-bold mb-4">{t('about.mission')}</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {t('home.mission_description')}
              </p>
            </div>

            {/* History */}
            <div>
              <h2 className="text-3xl font-bold mb-4">{t('about.history')}</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                The Liberian Chinese Society was founded in 2015 to strengthen cultural ties and create a supportive community for Chinese nationals and Chinese-Liberian citizens in Liberia.
              </p>
            </div>

            {/* Committee */}
            <div>
              <h2 className="text-3xl font-bold mb-8">{t('about.committee')}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {['Chairperson', 'Vice Chairperson', 'Treasurer', 'Secretary', 'Cultural Director', 'Member Representative'].map((role, i) => (
                  <div key={i} className="rounded-lg border border-gray-200 p-6 text-center">
                    <div className="h-20 w-20 bg-liberia-red/10 rounded-full mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Committee Member</h3>
                    <p className="text-sm text-gray-600">{role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </>
  );
}
