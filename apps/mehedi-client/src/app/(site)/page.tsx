import Link from 'next/link';
import { ArrowRight, Code2, Smartphone, Megaphone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const services = [
  {
    icon: Code2,
    title: 'Web Applications',
    desc: 'SaaS dashboards, booking platforms, marketing sites built with Next.js + TypeScript.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    desc: 'Cross-platform iOS and Android apps using React Native.',
  },
  {
    icon: Megaphone,
    title: 'Meta Marketing Ads',
    desc: 'End-to-end ad campaign setup, creative, and optimization for scale.',
  },
];

const highlights = [
  { label: 'Years shipping', value: '4+' },
  { label: 'Happy clients', value: '20+' },
  { label: 'Countries', value: '10+' },
  { label: 'Repeat rate', value: '85%' },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-500 blur-[120px]" />
          <div className="absolute top-40 left-1/4 h-64 w-64 rounded-full bg-accent-500 blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-24 md:px-6 md:pt-24 md:pb-32">
          <Badge tone="brand" className="mb-6">
            <Sparkles className="mr-1 h-3 w-3" />
            Available for new projects
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Full-stack developer building{' '}
            <span className="text-gradient-brand">SaaS, travel platforms,</span> and business tools.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            I&apos;m Mehedi Hasan — a self-taught developer from Dhaka with 4+ years shipping
            production apps. I turn ideas into fast, reliable products people actually use.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/start-project">
                Start a project <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/work">View my work</Link>
            </Button>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {highlights.map((h) => (
              <div key={h.label} className="rounded-2xl border border-app bg-card p-5">
                <dt className="text-xs uppercase tracking-wider text-subtle">{h.label}</dt>
                <dd className="mt-2 text-2xl font-semibold text-body">{h.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">What I do</h2>
            <p className="mt-2 max-w-lg text-muted">
              Three focused services — deep expertise, honest timelines, and code you can actually
              maintain.
            </p>
          </div>
          <Link href="/services" className="hidden text-sm text-muted hover:text-body md:inline">
            All services →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="group rounded-2xl border border-app bg-card p-6 transition-colors hover:border-strong">
              <div className="grid h-11 w-11 place-items-center rounded-xl gradient-brand text-white">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-6xl px-4 pb-16 md:px-6">
        <div className="rounded-3xl border border-app bg-card p-8 md:p-12">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Have an idea? Let&apos;s ship it.
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Every project starts with a short conversation on WhatsApp or a quick call. Tell me
            what you need — I&apos;ll come back with a plan, timeline, and a fair price.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/start-project">Start a project</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Say hi</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
