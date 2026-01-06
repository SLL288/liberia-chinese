import type { Metadata } from 'next';
import '../app/globals.css';

export const metadata: Metadata = {
  title: 'Liberian Chinese Society',
  description: 'Community website for Liberian Chinese Society',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
