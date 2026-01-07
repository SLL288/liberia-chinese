import type { Metadata } from 'next';
import { Manrope, Noto_Sans_SC } from 'next/font/google';
import '../app/globals.css';

export const metadata: Metadata = {
  title: '利比里亚华人分类信息 | Liberia Chinese Hub',
  description: '面向利比里亚华人社区的分类信息与生活服务平台',
};

const notoSans = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-display',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className={`${notoSans.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
