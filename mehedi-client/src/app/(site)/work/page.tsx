import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FEATURED_PROJECTS } from '@/lib/portfolio-data';
import { ProjectCard } from '@/components/site/project-card';

export const metadata: Metadata = { title: 'Work' };

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Selected work</h1>
        <p className="mt-6 text-lg text-muted">
          A snapshot of recent projects — the problem each client had, and what they got. Tap any
          card to see it live.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_PROJECTS.map((p) => (
          <ProjectCard key={p.slug} project={p} />
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
