import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Contact' };

export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Get in touch</h1>
      <p className="mt-6 text-lg text-muted">
        The fastest way to reach me is WhatsApp or email. For a full project brief, use the Start a
        Project form.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <a
          href="mailto:skmehedihasan.jr1@gmail.com"
          className="group flex items-start gap-4 rounded-2xl border border-app bg-card p-6 transition-colors hover:border-strong"
        >
          <div className="grid h-11 w-11 place-items-center rounded-xl gradient-brand text-white">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold">Email</div>
            <div className="mt-1 text-sm text-muted">skmehedihasan.jr1@gmail.com</div>
          </div>
        </a>
        {whatsapp ? (
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 rounded-2xl border border-app bg-card p-6 transition-colors hover:border-strong"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl gradient-brand text-white">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">WhatsApp</div>
              <div className="mt-1 text-sm text-muted">Fastest response</div>
            </div>
          </a>
        ) : null}
        <div className="flex items-start gap-4 rounded-2xl border border-app bg-card p-6 sm:col-span-2">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-elev text-body">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold">Location</div>
            <div className="mt-1 text-sm text-muted">Mirpur, Dhaka, Bangladesh · GMT+6</div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <Button asChild size="lg">
          <Link href="/start-project">Start a project brief →</Link>
        </Button>
      </div>
    </div>
  );
}
