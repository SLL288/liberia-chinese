import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container, Section, SectionTitle } from '@/components/ui/Layout';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />

      <Section>
        <Container>
          <SectionTitle className="mb-8">Privacy Policy</SectionTitle>

          <div className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-gray-700">
                Liberian Chinese Society ("we", "our", or "us") operates the liberiachinese.com website.
                This page informs you of our policies regarding the collection, use, and disclosure of
                personal data when you use our Service and the choices you have associated with that data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Information Collection and Use</h2>
              <p className="text-gray-700">
                We collect several different types of information for various purposes to provide and improve our Service to you.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>Personal Data: Email address, name, phone number, postal address, cookies and usage data</li>
                <li>Usage Data: Browser type, IP address, pages visited, time and date of visits</li>
                <li>Payment Information: Processed securely via Stripe</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Use of Data</h2>
              <p className="text-gray-700">Liberian Chinese Society uses the collected data for various purposes:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>Provide and maintain our Service</li>
                <li>Send you important information</li>
                <li>Gather analysis or valuable information for Service improvement</li>
                <li>Monitor Service usage</li>
                <li>Detect, prevent and address fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Security of Data</h2>
              <p className="text-gray-700">
                The security of your data is important to us but remember that no method of transmission over
                the Internet is 100% secure. We strive to use commercially acceptable means to protect your
                Personal Data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Contact Us</h2>
              <p className="text-gray-700">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-700 mt-2">
                Email: info@liberiachinese.com<br />
                Address: Monrovia, Liberia
              </p>
            </section>
          </div>
        </Container>
      </Section>

      <Footer />
    </>
  );
}
