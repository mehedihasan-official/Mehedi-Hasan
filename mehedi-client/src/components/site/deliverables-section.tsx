import { CodeXml, Megaphone, Smartphone } from "lucide-react";

const deliverables = [
  {
    icon: CodeXml,
    title: "Web Application and CRM Development",
    description:
      "Purpose-built web platforms, customer portals, booking flows, and CRMs that make day-to-day work easier and help teams serve customers better.",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description:
      "Mobile experiences for iOS and Android, planned around real user needs and connected to the tools and services your business already uses.",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description:
      "Campaign strategy, conversion tracking, and ongoing optimization focused on qualified leads and measurable business outcomes.",
  },
];

export function DeliverablesSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14 md:px-6 md:py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-brand-400">How I help</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          What I actually deliver
        </h2>
        <p className="mt-3 text-muted">
          Start with the problem you want to solve. We&apos;ll shape the right
          approach together before agreeing on scope and budget.
        </p>
      </div>
      <div className="mt-8 divide-y divide-app border-y border-app">
        {deliverables.map((item, index) => (
          <article
            key={item.title}
            className="grid gap-4 py-5 sm:grid-cols-[3rem_1fr] sm:gap-5 sm:py-6"
          >
            <div className="flex items-center gap-3 sm:block">
              <span className="text-xs font-mono text-muted">0{index + 1}</span>
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-elev text-brand-400 sm:mt-3">
                <item.icon className="h-5 w-5" />
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
