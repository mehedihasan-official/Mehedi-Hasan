import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">About Mehedi</h1>
      <p className="mt-6 text-lg text-muted">
        I&apos;m a self-taught full-stack developer based in Mirpur, Dhaka. For the last four years
        I&apos;ve built SaaS platforms, travel and booking systems, e-commerce sites, and internal
        tools for clients across the US, Europe, and the Middle East.
      </p>
      <p className="mt-4 text-lg text-muted">
        My daily stack is Next.js, TypeScript, Node/Express, MongoDB, Tailwind, and Framer Motion.
        I care about clean, maintainable code and interfaces that feel great on mobile — because
        that&apos;s where most people meet the product.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {[
          { k: 'Location', v: 'Mirpur, Dhaka, Bangladesh' },
          { k: 'Timezone', v: 'GMT+6 (Asia/Dhaka)' },
          { k: 'Availability', v: 'Open for new projects' },
          { k: 'Payment', v: 'Payoneer (USD), bKash (BDT)' },
        ].map((r) => (
          <div key={r.k} className="rounded-xl border border-app bg-card p-5">
            <div className="text-xs uppercase tracking-wider text-subtle">{r.k}</div>
            <div className="mt-2 text-body">{r.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
