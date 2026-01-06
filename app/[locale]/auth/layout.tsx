import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container, Section } from '@/components/ui/Layout';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Section className="flex-1">
        <Container className="max-w-md">
          {children}
        </Container>
      </Section>
      <Footer />
    </>
  );
}
