import { redirect } from 'next/navigation';

export default async function SignupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return redirect(`/${locale}/auth/login`);
}
