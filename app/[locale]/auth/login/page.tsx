import { redirect } from 'next/navigation';

export default async function LegacyLogin({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return redirect(`/${locale}/login`);
}
