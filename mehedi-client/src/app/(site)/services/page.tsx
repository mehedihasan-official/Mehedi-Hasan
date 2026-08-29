import type { Metadata } from 'next';
import Link from 'next/link';
import { Globe, Smartphone, Megaphone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Services' };

const services = [
  {
    icon: Globe,
    title: 'Websites & Web Apps That Earn',
    starting: 'from $500',
    tagline: 'Landing pages, SaaS, booking platforms — anything that lives on the web.',
    good_for: 'Founders who need a site that actually closes leads. Agencies who lost their dev. Businesses tired of a slow WordPress that scares people away.',
    outcomes: [
      'Fast, mobile-first design your customers trust in the first 3 seconds',
      'Real booking / signup / payment flows — not just a pretty landing page',
      'Admin dashboard so you can update content yourself',
      'Deployed live, source code yours to keep',
    ],
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps Your Customers Actually Use',
    starting: 'from $1,200',
    tagline: 'iOS + Android from one codebase. Backend included when you need one.',
    good_for: 'Businesses whose customers spend all day on their phone. Founders launching a new product. Anyone who says "there should be an app for this."',
    outcomes: [
      'Cross-platform (React Native / Expo) — one codebase, both stores',
      'Push notifications, payments, in-app messaging',
      'Store submission handled end-to-end',
      'Simple admin so you can push updates without me',
    ],
  },
  {
    icon: Megaphone,
    title: 'Meta Ads That Bring Real Buyers',
    starting: 'from $300/mo',
    tagline: 'Facebook + Instagram ads set up right, tested, and optimized month over month.',
    good_for: 'Local businesses ready to scale. E-commerce brands stuck at a plateau. Anyone whose ads are burning money without results.',
    outcomes: [
      'Pixel + conversion tracking set up correctly (this alone fixes half the leaks)',
      'Ad creative + copy that stops the scroll',
      'A/B tested so budget goes to what actually works',
      'Monthly report you can actually understand',
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Three services. Focused on your outcome.
        </h1>
        <p className="mt-6 text-lg text-muted">
          I don&apos;t do everything — I do these three things really well. Pick what fits, or tell me
          the problem and I&apos;ll suggest the right one.
        </p>
      </div>

      <div className="mt-12 space-y-6">
        {services.map((s) => (
          <div key={s.title} className="rounded-2xl border border-app bg-card p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-brand text-white">
                  <s.icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold md:text-2xl">{s.title}</h2>
                  <p className="mt-1 text-muted">{s.tagline}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wider text-subtle">Starting</div>
                <div className="mt-1 text-lg font-semibold">{s.starting}</div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-wider text-subtle">Right for you if</div>
                <p className="mt-2 text-sm text-body">{s.good_for}</p>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-subtle">What you get</div>
                <ul className="mt-2 space-y-2">
                  {s.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2 text-sm text-body">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /> {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 border-t border-app pt-4">
              <Button asChild variant="outline">
                <Link href="/start-project">Start a project like this →</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
