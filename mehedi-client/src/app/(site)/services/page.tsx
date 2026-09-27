import { Button } from "@/components/ui/button";
import { Check, Globe, Megaphone, Smartphone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Services" };

const services = [
  {
    icon: Globe,
    title: "Web Application and CRM Development",
    tagline:
      "Custom web platforms, customer portals, booking systems, and CRMs built around the way your team works.",
    good_for:
      "Businesses replacing manual processes, founders validating a product, and teams that need software shaped to their workflow.",
    outcomes: [
      "Responsive interfaces that work smoothly on phones and desktops",
      "Customer, booking, and internal workflows designed around your requirements",
      "Integrations with the tools and services your business already uses",
      "A clear handover so your team can confidently use and maintain the product",
    ],
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    tagline:
      "Mobile products planned for the needs of your customers and the realities of your business.",
    good_for:
      "Teams extending an existing service to mobile or founders building a new app experience.",
    outcomes: [
      "iOS and Android experiences with a consistent product flow",
      "Authentication, notifications, and connected backend services as needed",
      "Mobile-first screens tested across common device sizes",
      "Release preparation and a practical handover",
    ],
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    tagline:
      "Measurement-led campaigns and optimization connected to your business goals.",
    good_for:
      "Businesses that need a clearer path from campaign activity to qualified leads and customers.",
    outcomes: [
      "Campaign planning based on your audience and offer",
      "Conversion tracking and measurement setup",
      "Creative and landing-page recommendations",
      "Ongoing review focused on useful performance signals",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          A practical approach, shaped around your goals.
        </h1>
        <p className="mt-6 text-lg text-muted">
          There are no fixed packages to choose from. We&apos;ll first discuss
          your goals, scope, and constraints, then agree on the right approach
          and budget before work begins.
        </p>
      </div>

      <div className="mt-12 space-y-6">
        {services.map((s) => (
          <div
            key={s.title}
            className="rounded-2xl border border-app bg-card p-6 md:p-8"
          >
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-brand text-white">
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold md:text-2xl">{s.title}</h2>
                <p className="mt-1 text-muted">{s.tagline}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-wider text-subtle">
                  Right for you if
                </div>
                <p className="mt-2 text-sm text-body">{s.good_for}</p>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-subtle">
                  What you get
                </div>
                <ul className="mt-2 space-y-2">
                  {s.outcomes.map((o) => (
                    <li
                      key={o}
                      className="flex items-start gap-2 text-sm text-body"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />{" "}
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 border-t border-app pt-4">
              <Button asChild variant="outline">
                <Link href="/contact">Discuss your project →</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
