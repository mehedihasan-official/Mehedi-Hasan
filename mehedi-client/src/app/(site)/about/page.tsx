import mehediPhoto from "@/assets/images/mehedi-hasan.jpg";
import { DeliverablesSection } from "@/components/site/deliverables-section";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
      {/* Heading beside a small photo — mobile & tablet only. Desktop uses
          the full sticky portrait below instead. */}
      <div className="flex items-start gap-4 sm:gap-6 lg:hidden">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            About Mehedi
          </h1>
          <p className="mt-3 text-base text-muted sm:text-lg">
            I&apos;m a developer, but the work I do isn&apos;t about code —
            it&apos;s about giving my clients a real advantage.
          </p>
        </div>
        <div className="relative w-24 shrink-0 sm:w-32">
          <div className="overflow-hidden rounded-3xl border border-app bg-card shadow-card">
            <Image
              src={mehediPhoto}
              alt="Mehedi Hasan"
              className="aspect-4/5 w-full object-cover"
              placeholder="blur"
              priority
              sizes="128px"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-12 lg:mt-0 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
        <div className="relative mx-auto hidden w-full max-w-xs lg:block lg:sticky lg:top-24 lg:max-w-none">
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-linear-to-br from-brand-500/25 to-accent-500/15 blur-2xl" />
          <div className="overflow-hidden rounded-4xl border border-app bg-card shadow-card">
            <Image
              src={mehediPhoto}
              alt="Mehedi Hasan"
              className="aspect-4/5 w-full object-cover"
              placeholder="blur"
              sizes="360px"
            />
          </div>
        </div>

        <div>
          <h1 className="hidden text-4xl font-bold tracking-tight md:text-5xl lg:block">
            About Mehedi
          </h1>

          <p className="mt-4 hidden text-lg text-muted lg:mt-6 lg:block">
            I&apos;m a developer, but the work I do isn&apos;t about code —
            it&apos;s about giving my clients a real advantage. A faster site
            that keeps customers. A booking flow that closes sales while they
            sleep. Ads that finally bring buyers instead of just clicks.
          </p>
          <p className="mt-4 text-lg text-muted">
            Over five years, I&apos;ve helped founders, agencies, and growing
            businesses across the US, Europe, the Middle East, and other markets
            build SaaS platforms, travel and booking systems, e-commerce
            experiences, and internal tools. I work directly with each client,
            learning how their business operates before recommending a practical
            solution.
          </p>
          <p className="mt-4 text-lg text-muted">
            Collaboration is remote-first: clear written updates, scheduled
            calls across time zones, and direct communication from the first
            conversation through handover.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {[
              { k: "Clients", v: "Founders and teams worldwide" },
              { k: "Collaboration", v: "Remote-first, direct communication" },
              { k: "Experience", v: "5+ years shipping" },
              { k: "Clients served", v: "210+" },
              { k: "Countries served", v: "20+" },
              { k: "Repeat clients", v: "85% come back" },
            ].map((r) => (
              <div
                key={r.k}
                className="rounded-xl border border-app bg-card p-5"
              >
                <div className="text-xs uppercase tracking-wider text-subtle">
                  {r.k}
                </div>
                <div className="mt-2 text-body">{r.v}</div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="/dashboard/orders/new">
                Tell me about your project →
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <DeliverablesSection />
    </div>
  );
}
