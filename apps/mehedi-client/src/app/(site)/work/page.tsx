import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Work' };

const projects = [
  { title: 'Platinum Club', tag: 'Travel & Booking', url: 'https://travelleisure.vip' },
  { title: 'Travel + Leisure', tag: 'Travel & Booking', url: 'https://travelclub.it.com' },
  { title: 'RCI', tag: 'Travel & Booking', url: 'https://rcitravelleisure.com' },
  { title: 'IFX Payments Clone', tag: 'Fintech / Landing' },
  { title: 'DBSEE Digital Marketing', tag: 'Marketing / Agency' },
  { title: 'Email Finder Tool', tag: 'SaaS', url: 'https://emailfindertool.com' },
];

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Selected work</h1>
        <p className="mt-6 text-lg text-muted">
          A snapshot of recent projects. Full case studies coming soon — for now, browse a few
          highlights below.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <article key={p.title} className="group rounded-2xl border border-app bg-card p-6 transition-colors hover:border-strong">
            <div className="aspect-[4/3] rounded-xl gradient-brand opacity-80" />
            <div className="mt-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <div className="text-xs text-subtle">{p.tag}</div>
              </div>
              {p.url ? (
                <Button asChild variant="ghost" size="sm">
                  <a href={p.url} target="_blank" rel="noopener noreferrer">Visit →</a>
                </Button>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16 rounded-3xl border border-app bg-card p-8 md:p-12">
        <h2 className="text-2xl font-semibold tracking-tight">Want something similar?</h2>
        <p className="mt-2 max-w-xl text-muted">
          I take a small number of new projects each month. Let&apos;s see if yours fits.
        </p>
        <div className="mt-6">
          <Button asChild size="lg">
            <Link href="/start-project">Start a project</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
