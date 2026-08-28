import type { Metadata } from 'next';
import Link from 'next/link';
import { Code2, Smartphone, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Services' };

const services = [
  {
    icon: Code2,
    title: 'Web Application',
    desc: 'Custom SaaS, dashboards, booking platforms, and marketing sites — production-grade Next.js + TypeScript.',
    starting: 'from $500',
    features: [
      'Next.js 15 + TypeScript',
      'Auth, database, admin panel',
      'Mobile-first responsive UI',
      'Deployment on Vercel',
    ],
  },
  {
    icon: Smartphone,
    title: 'Mobile App',
    desc: 'Cross-platform iOS + Android apps built with React Native or Expo. Backend included when you need one.',
    starting: 'from $1,200',
    features: [
      'React Native / Expo',
      'iOS + Android from one codebase',
      'Push notifications',
      'Store submission support',
    ],
  },
  {
    icon: Megaphone,
    title: 'Meta Marketing Ads',
    desc: 'Facebook + Instagram ad campaign setup, creative, targeting, and ongoing optimization.',
    starting: 'from $300/mo',
    features: [
      'Pixel + conversion setup',
      'Ad creative + copywriting',
      'A/B testing',
      'Monthly reports',
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Services</h1>
        <p className="mt-6 text-lg text-muted">
          Three focused services. Every project starts with a short conversation so you know
          exactly what you&apos;re getting.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {services.map((s) => (
          <div key={s.title} className="flex flex-col rounded-2xl border border-app bg-card p-6">
            <div className="grid h-11 w-11 place-items-center rounded-xl gradient-brand text-white">
              <s.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
            <div className="mt-1 text-sm text-subtle">{s.starting}</div>
            <p className="mt-3 text-sm text-muted">{s.desc}</p>
            <ul className="mt-5 space-y-2 text-sm text-muted">
              {s.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-500" /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/start-project">Start a project</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
