import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  MessageCircle,
  Clock,
  ShieldCheck,
  Wallet,
  TrendingUp,
  Rocket,
  Handshake,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FEATURED_PROJECTS, TESTIMONIALS } from '@/lib/portfolio-data';
import { ProjectCard } from '@/components/site/project-card';
import { TestimonialCard } from '@/components/site/testimonial-card';

const outcomes = [
  {
    icon: TrendingUp,
    title: 'Websites that grow your revenue',
    desc: 'Landing pages, storefronts, and SaaS that turn visitors into customers — not just look pretty.',
  },
  {
    icon: Rocket,
    title: 'Apps your customers actually use',
    desc: 'iOS + Android from one codebase. Push notifications, payments, everything ready.',
  },
  {
    icon: Handshake,
    title: 'Ads that bring real buyers',
    desc: "Meta ads set up, tested, and optimized so you're not lighting money on fire.",
  },
];

const whyMe = [
  {
    icon: MessageCircle,
    title: 'You talk to me, not a sales rep',
    desc: "No middlemen. You get direct WhatsApp access from day one until launch — and after.",
  },
  {
    icon: Clock,
    title: 'Weeks, not quarters',
    desc: "Most projects ship in 2–6 weeks. I give you an honest timeline and stick to it.",
  },
  {
    icon: ShieldCheck,
    title: 'You own everything',
    desc: "Full source code, deployed to your account. No lock-in, no monthly fees to me.",
  },
  {
    icon: Wallet,
    title: 'Fair, upfront pricing',
    desc: "No hidden costs. You know the price before we start. Payoneer or bKash — your call.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-500 blur-[120px]" />
          <div className="absolute top-40 left-1/4 h-64 w-64 rounded-full bg-accent-500 blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-24 md:px-6 md:pt-24 md:pb-32">
          <Badge tone="brand" className="mb-6">
            <Sparkles className="mr-1 h-3 w-3" />
            Taking on 2 new projects this month
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Your idea, <span className="text-gradient-brand">shipped and earning</span> — without the tech headache.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            You know your business. I build the tech that grows it — websites, apps, and ads that
            save you hours, win you customers, and let you sleep at night. No jargon. No excuses.
            Just work that ships.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/start-project">
                Start your project <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#work">See what I&apos;ve built</Link>
            </Button>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Years shipping', value: '4+' },
              { label: 'Happy clients', value: '20+' },
              { label: 'Countries served', value: '10+' },
              { label: 'Come back for more', value: '85%' },
            ].map((h) => (
              <div key={h.label} className="rounded-2xl border border-app bg-card p-5">
                <dt className="text-xs uppercase tracking-wider text-subtle">{h.label}</dt>
                <dd className="mt-2 text-2xl font-semibold text-body">{h.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- Outcomes ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            What I actually deliver
          </h2>
          <p className="mt-2 text-muted">
            Not a list of technologies. A list of results. You bring the goal — I bring the execution.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {outcomes.map((o) => (
            <div
              key={o.title}
              className="group rounded-2xl border border-app bg-card p-6 transition-colors hover:border-strong"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl gradient-brand text-white">
                <o.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{o.title}</h3>
              <p className="mt-2 text-sm text-muted">{o.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Projects gallery ---------------- */}
      <section id="work" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Real problems. Real results.
            </h2>
            <p className="mt-2 text-muted">
              A handful of recent projects — with the problem the client had and what they got.
            </p>
          </div>
          <Link href="/work" className="hidden text-sm text-muted hover:text-body md:inline">
            All projects →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_PROJECTS.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      {/* ---------------- Why me ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Why business owners keep coming back
          </h2>
          <p className="mt-2 text-muted">
            85% of my work is from repeat clients. Here&apos;s why.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyMe.map((w) => (
            <div key={w.title} className="rounded-2xl border border-app bg-card p-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-elev">
                <w.icon className="h-5 w-5 text-brand-500" />
              </div>
              <h3 className="mt-5 font-semibold">{w.title}</h3>
              <p className="mt-2 text-sm text-muted">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Testimonials ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            What clients actually say
          </h2>
          <p className="mt-2 text-muted">
            Straight from WhatsApp, Fiverr, and email. No cherry-picking.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="mx-auto mt-8 max-w-6xl px-4 pb-16 md:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-app bg-card p-8 md:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/30 blur-[100px]" />
          <div className="relative">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Have an idea? Let&apos;s make it real.
            </h2>
            <p className="mt-3 max-w-2xl text-muted">
              Every project starts with a short conversation on WhatsApp or a quick call. Tell me
              what you need — I&apos;ll come back with a plan, timeline, and a fair price. No pressure.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/start-project">Start your project</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Or just say hi</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
