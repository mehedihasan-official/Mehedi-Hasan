import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Mehedi Hasan — Full-stack Developer',
    template: '%s · Mehedi Hasan',
  },
  description:
    'Mehedi Hasan builds SaaS, travel platforms, and business tools with Next.js, TypeScript, and modern web tech. Based in Dhaka, working worldwide.',
  keywords: ['Mehedi Hasan', 'Next.js developer', 'MERN', 'freelance developer', 'Bangladesh'],
  authors: [{ name: 'Mehedi Hasan' }],
  openGraph: {
    title: 'Mehedi Hasan — Full-stack Developer',
    description:
      'SaaS, travel platforms, and business tools — built with Next.js and modern web tech.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh bg-app text-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
