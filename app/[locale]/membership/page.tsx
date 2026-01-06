import React from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container, Section, SectionTitle } from '@/components/ui/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function MembershipPage() {
  const t = useTranslations();

  const tiers = [
    {
      name: 'Free',
      price: '$0',
      description: 'Get started for free',
      features: [
        'Access to public events',
        'Newsletter',
        'Community forum access',
      ],
    },
    {
      name: 'Standard',
      price: '$50/year',
      description: 'Most popular',
      features: [
        'All Free features',
        'Exclusive events',
        'Member directory listing',
        'Discounted event tickets',
        'Priority support',
      ],
      featured: true,
    },
    {
      name: 'Premium',
      price: '$150/year',
      description: 'Enhanced benefits',
      features: [
        'All Standard features',
        'Featured directory listing',
        'Priority event registration',
        'Quarterly networking events',
        'Free workshop attendance',
      ],
    },
    {
      name: 'Patron',
      price: '$500/year',
      description: 'Premium support',
      features: [
        'All Premium features',
        'VIP event access',
        'Exclusive mentor program',
        'Business promotion',
        '1-on-1 support',
      ],
    },
  ];

  return (
    <>
      <Header />
      <Section className="bg-gradient-to-br from-liberia-red to-liberia-dark-red text-white">
        <Container>
          <SectionTitle className="text-white mb-4">{t('membership.title')}</SectionTitle>
          <p className="text-red-100 text-lg max-w-2xl">
            Join our community and unlock exclusive benefits
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle className="text-center mb-4">{t('membership.benefits')}</SectionTitle>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Choose a membership tier that fits your needs and start enjoying community benefits today.
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            {tiers.map((tier, i) => (
              <Card
                key={i}
                className={tier.featured ? 'ring-2 ring-liberia-gold md:col-span-4 md:flex md:flex-row md:col-span-4' : ''}
              >
                <CardHeader className={tier.featured ? 'md:flex-1' : ''}>
                  <CardTitle>{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-liberia-red mt-2">{tier.price}</div>
                  <CardDescription className="mt-2">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className={tier.featured ? 'md:flex-1' : ''}>
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((feature, j) => (
                      <li key={j} className="flex gap-2">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      tier.featured ? 'bg-liberia-gold text-liberia-navy hover:opacity-90' : ''
                    }`}
                    asChild
                  >
                    <Link href="/en/auth/signup">{t('membership.join_now')}</Link>
                  </Button>
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
