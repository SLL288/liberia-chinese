import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container, Section, SectionTitle } from '@/components/ui/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users, Calendar, Newspaper, DollarSign, AlertCircle, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const t = useTranslations();

  const stats = [
    { icon: Users, label: 'Total Members', value: '523', color: 'bg-blue-500' },
    { icon: Calendar, label: 'Total Events', value: '18', color: 'bg-purple-500' },
    { icon: Newspaper, label: 'Total Posts', value: '45', color: 'bg-green-500' },
    { icon: DollarSign, label: 'Revenue', value: '$12,450', color: 'bg-yellow-500' },
  ];

  return (
    <>
      <Header />

      <Section>
        <Container>
          <div className="mb-8">
            <SectionTitle className="mb-2">Admin Dashboard</SectionTitle>
            <p className="text-gray-600">Manage your community platform</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <Icon className="text-white" size={24} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Admin Actions */}
          <SectionTitle className="text-xl mb-4">Quick Actions</SectionTitle>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar size={24} />
                  Manage Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Create and manage community events</p>
                <Button className="w-full" asChild>
                  <Link href="/en/admin/events">View All</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Newspaper size={24} />
                  Manage Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Create and publish news articles</p>
                <Button className="w-full" asChild>
                  <Link href="/en/admin/posts">View All</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users size={24} />
                  Manage Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Manage member accounts and roles</p>
                <Button className="w-full" asChild>
                  <Link href="/en/admin/users">View All</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Pending Approvals */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="text-yellow-500" />
                Pending Approvals
              </CardTitle>
              <CardDescription>
                Items awaiting review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium">Directory Listing</p>
                    <p className="text-sm text-gray-600">New business submission</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Reject</Button>
                    <Button size="sm">Approve</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium">Sponsor Application</p>
                    <p className="text-sm text-gray-600">Gold tier sponsorship request</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Reject</Button>
                    <Button size="sm">Approve</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Other Admin Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">View traffic and engagement metrics</p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/en/admin/analytics">View Analytics</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Manage site configuration</p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/en/admin/settings">Go to Settings</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      <Footer />
    </>
  );
}
