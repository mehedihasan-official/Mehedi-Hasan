import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Contact' };

const EMAILS = [
  'skmehedihasan.jr1@gmail.com',
  'mehedihasanshopnil.jr@gmail.com',
];

export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Let&apos;s talk about your project</h1>
      <p className="mt-6 text-lg text-muted">
        Fastest way to reach me is WhatsApp. If you&apos;d rather email or send a full brief, both
        work — I reply within a day, wherever you write from.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {whatsapp ? (
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent("Hi Mehedi, I'd like to talk about a project.")}`}
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
              <div className="mt-1 text-xs text-subtle">Tap to open a chat with me directly.</div>
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

        <div className="flex items-start gap-4 rounded-2xl border border-app bg-card p-6 sm:col-span-2">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-elev text-body">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold">Where I&apos;m based</div>
            <div className="mt-1 text-sm text-muted">Mirpur, Dhaka, Bangladesh · GMT+6</div>
            <div className="mt-1 text-xs text-subtle">
              I work with clients in the US, Europe, and the Middle East. Timezones are never a problem.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-app bg-card p-6">
        <h2 className="font-semibold">Have a full project in mind?</h2>
        <p className="mt-1 text-sm text-muted">
          Send a proper brief — budget, timeline, what you need — and I&apos;ll come back with a plan
          the same day.
        </p>
        <div className="mt-4">
          <Button asChild size="lg">
            <Link href="/start-project">Send a project brief →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
