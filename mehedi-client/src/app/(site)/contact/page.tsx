import { Button } from "@/components/ui/button";
import { Facebook, Linkedin, Mail, MapPin, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Contact" };

const EMAILS = [
  "skmehedihasan.jr1@gmail.com",
  "mehedihasanshopnil.jr@gmail.com",
];
const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/skmehedihasansumu",
    icon: Facebook,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mehedishopnil",
    icon: Linkedin,
  },
];

export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
        Let&apos;s talk about your project
      </h1>
      <p className="mt-6 text-lg text-muted">
        Fastest way to reach me is WhatsApp. If you&apos;d rather email or send
        a full brief, both work — I reply within a day, wherever you write from.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {whatsapp ? (
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hi Mehedi, I'd like to talk about a project.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 rounded-2xl border border-app bg-card p-6 transition-colors hover:border-strong sm:col-span-2"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl gradient-brand text-white">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">WhatsApp — fastest reply</div>
              <div className="mt-1 text-sm text-muted">{whatsapp}</div>
              <div className="mt-1 text-xs text-subtle">
                Tap to open a chat with me directly.
              </div>
            </div>
          </a>
        ) : null}

        {EMAILS.map((email) => (
          <a
            key={email}
            href={`mailto:${email}`}
            className="group flex items-start gap-4 rounded-2xl border border-app bg-card p-6 transition-colors hover:border-strong"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-elev text-body">
              <Mail className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold">Email</div>
              <div className="mt-1 truncate text-sm text-muted">{email}</div>
            </div>
          </a>
        ))}

        {SOCIALS.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-24 items-center gap-4 rounded-xl border border-app bg-card p-5 transition-colors hover:border-strong"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-elev text-body">
              <Icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-semibold">{label}</span>
              <span className="mt-1 block text-sm text-muted">
                Connect with me
              </span>
            </span>
          </a>
        ))}

        <div className="flex items-start gap-4 rounded-2xl border border-app bg-card p-6 sm:col-span-2">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-elev text-body">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold">Working worldwide</div>
            <div className="mt-1 text-sm text-muted">
              Remote collaboration across time zones
            </div>
            <div className="mt-1 text-xs text-subtle">
              I work with clients in the US, Europe, the Middle East, and other
              markets. Calls are scheduled to suit both sides.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-app bg-card p-6">
        <h2 className="font-semibold">Have a full project in mind?</h2>
        <p className="mt-1 text-sm text-muted">
          Send a proper brief — budget, timeline, what you need — and I&apos;ll
          come back with a plan the same day.
        </p>
        <div className="mt-4">
          <Button asChild size="lg">
            <Link href="/dashboard/orders/new">Place an order →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
