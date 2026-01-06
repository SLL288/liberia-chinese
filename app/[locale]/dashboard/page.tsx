import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container, Section, SectionTitle } from '@/components/ui/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Clock, AlertCircle, Download } from 'lucide-react';

export default function DashboardPage() {
  const t = useTranslations();

  return (
    <>
      <Header />

      <Section>
        <Container>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Welcome Card */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="text-2xl">Welcome back, John!</CardTitle>
                <CardDescription>
                  Here's an overview of your membership and activities
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Membership Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-gray-600">Membership Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="text-green-600" size={32} />
                  <div>
                    <p className="font-semibold text-lg">Standard</p>
                    <p className="text-sm text-gray-600">Active until Jan 2026</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="#upgrade">Upgrade Plan</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Events Attended */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-gray-600">Events Attended</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-liberia-red mb-2">5</p>
                <p className="text-sm text-gray-600 mb-4">This year</p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/en/events">Browse Events</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Member Since */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-gray-600">Member Since</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold mb-2">January 2024</p>
                <p className="text-sm text-gray-600 mb-4">2 years active</p>
                <Button variant="outline" className="w-full">View Profile</Button>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="space-y-6">
            {/* RSVP History */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Your RSVPs</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-start justify-between border-b border-gray-200 pb-4 last:border-0">
                        <div className="flex-1">
                          <h3 className="font-semibold">Community Gathering {i}</h3>
                          <p className="text-sm text-gray-600">January {15 + i}, 2025 at 2:00 PM</p>
                          <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Attending
                          </span>
                        </div>
                        <Button size="sm" variant="outline">
                          Manage
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Invoices & Receipts */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Invoices & Receipts</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {[
                      { date: 'Jan 15, 2025', amount: '$50.00', type: 'Annual Membership' },
                      { date: 'Jan 10, 2025', amount: '$25.00', type: 'Event Ticket' },
                      { date: 'Dec 20, 2024', amount: '$100.00', type: 'Donation' },
                    ].map((invoice, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{invoice.type}</p>
                          <p className="text-sm text-gray-600">{invoice.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">{invoice.amount}</span>
                          <Button size="sm" variant="ghost" asChild>
                            <a href="#">
                              <Download size={16} />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Edit Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      placeholder="+231 XX XXX XXXX"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">WeChat ID</label>
                    <input
                      type="text"
                      placeholder="your_wechat_id"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <Button className="w-full">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      <Footer />
    </>
  );
}
