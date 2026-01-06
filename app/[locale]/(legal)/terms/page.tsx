import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container, Section, SectionTitle } from '@/components/ui/Layout';

export default function TermsPage() {
  return (
    <>
      <Header />

      <Section>
        <Container>
          <SectionTitle className="mb-8">Terms of Service</SectionTitle>

          <div className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700">
                By accessing and using this website, you accept and agree to be bound by the terms and provision
                of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
              <p className="text-gray-700">
                Permission is granted to temporarily download one copy of the materials (information or software)
                on the Liberian Chinese Society website for personal, non-commercial transitory viewing only.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Disclaimer</h2>
              <p className="text-gray-700">
                The materials on the Liberian Chinese Society website are provided without any guarantees or
                conditions. Any reliance you place on such material is strictly at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Limitations of Liability</h2>
              <p className="text-gray-700">
                In no event shall Liberian Chinese Society or its suppliers be liable for any damages (including,
                without limitation, damages for loss of data or profit, or due to business interruption) arising
                out of the use or inability to use the materials on the website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. User Conduct</h2>
              <p className="text-gray-700">You agree not to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>Post content that is illegal or unlawful</li>
                <li>Post content that is offensive or inappropriate</li>
                <li>Attempt to gain unauthorized access to systems</li>
                <li>Spam or abuse other users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
              <p className="text-gray-700">
                If you have questions about these Terms, please contact us at:
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
