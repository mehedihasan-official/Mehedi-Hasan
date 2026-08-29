import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">About Mehedi</h1>

      <p className="mt-6 text-lg text-muted">
        I&apos;m a developer, but the work I do isn&apos;t about code — it&apos;s about giving my
        clients a real advantage. A faster site that keeps customers. A booking flow that closes
        sales while they sleep. Ads that finally bring buyers instead of just clicks.
      </p>
      <p className="mt-4 text-lg text-muted">
        For the last four years I&apos;ve built SaaS platforms, travel and booking systems,
        e-commerce sites, and internal tools for founders, agencies, and small businesses across
        the US, Europe, and the Middle East. My favorite part is the first call — when someone
        explains what they&apos;re trying to grow, and we figure out together how to actually get
        there.
      </p>
      <p className="mt-4 text-lg text-muted">
        Based in Dhaka, working worldwide. Direct, honest, and easy to talk to.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {[
          { k: 'Based in', v: 'Mirpur, Dhaka, Bangladesh' },
          { k: 'Timezone', v: 'GMT+6 (Asia/Dhaka)' },
          { k: 'Availability', v: 'Open for 2 new projects' },
          { k: 'Payment', v: 'Payoneer (USD) · bKash (BDT)' },
          { k: 'Experience', v: '4+ years shipping' },
          { k: 'Repeat clients', v: '85% come back' },
        ].map((r) => (
          <div key={r.k} className="rounded-xl border border-app bg-card p-5">
            <div className="text-xs uppercase tracking-wider text-subtle">{r.k}</div>
            <div className="mt-2 text-body">{r.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Button asChild size="lg">
          <Link href="/start-project">Tell me about your project →</Link>
        </Button>
      </div>
    </div>
  );
}
