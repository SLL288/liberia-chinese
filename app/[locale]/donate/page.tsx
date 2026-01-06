import React from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container, Section, SectionTitle } from '@/components/ui/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function DongtePage() {
  const t = useTranslations();

  const sponsorTiers = [
    {
      name: 'Gold Sponsor',
      amount: '$5,000+',
      benefits: [
        'Logo on homepage (12 months)',
        'Featured announcement (3 posts)',
        'Banner ad on all pages',
        'Social media feature',
        'Event sponsorship recognition',
      ],
      featured: true,
    },
    {
      name: 'Silver Sponsor',
      amount: '$2,500',
      benefits: [
        'Logo on homepage (6 months)',
        'Featured announcement (2 posts)',
        'Social media feature',
        'Event recognition',
      ],
    },
    {
      name: 'Bronze Sponsor',
      amount: '$1,000',
      benefits: [
        'Logo on homepage (3 months)',
        'Featured announcement (1 post)',
        'Event recognition',
      ],
    },
  ];

  return (
    <>
      <Header />
      <Section className="bg-gradient-to-br from-liberia-red to-liberia-dark-red text-white">
        <Container>
          <SectionTitle className="text-white mb-4">{t('donate.title')}</SectionTitle>
          <p className="text-red-100 text-lg max-w-2xl">
            Support our mission to promote Chinese culture and community building
          </p>
        </Container>
      </Section>

      {/* Donation Section */}
      <Section>
        <Container>
          <div className="max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">{t('donate.donate_now')}</h2>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <button className="rounded-lg border-2 border-liberia-red px-4 py-3 text-liberia-red font-medium hover:bg-liberia-red hover:text-white transition-colors">
                {t('donate.one_time')}
              </button>
              <button className="rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-700 font-medium hover:border-liberia-red transition-colors">
                {t('donate.monthly')}
              </button>
            </div>

            <div className="grid sm:grid-cols-4 gap-3 mb-8">
              {[25, 50, 100, 250].map((amount) => (
                <button
                  key={amount}
                  className="rounded-lg border border-gray-300 px-4 py-3 font-medium hover:border-liberia-red hover:text-liberia-red transition-colors"
                >
                  ${amount}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Custom Amount (USD)</label>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-liberia-red focus:outline-none"
              />
            </div>

            <Button className="w-full mb-4">{t('donate.donate_now')}</Button>
            <p className="text-center text-sm text-gray-600">
              {t('donate.tax_deductible')}
            </p>
          </div>
        </Container>
      </Section>

      {/* Sponsorship Section */}
      <Section className="bg-gray-50">
        <Container>
          <SectionTitle className="text-center mb-12">{t('donate.sponsorship')}</SectionTitle>
          <div className="grid md:grid-cols-3 gap-6">
            {sponsorTiers.map((tier, i) => (
              <Card key={i} className={tier.featured ? 'ring-2 ring-liberia-gold md:scale-105' : ''}>
                <CardHeader>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-liberia-red mt-2">{tier.amount}</div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {tier.benefits.map((benefit, j) => (
                      <div key={j} className="flex gap-2">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full">Sponsor Now</Button>
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
