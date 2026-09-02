import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Mail, Phone, MapPin, Clock, MessageCircle, ArrowLeft, Copy } from 'lucide-react';
import { getSession } from '@/lib/session';
import { apiFetchSafe } from '@/lib/api';
import type { Client } from '@/shared';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { formatCurrency, formatDate, whatsappLink } from '@/lib/utils';
import { ClientEditForm } from './client-edit-form';

export const dynamic = 'force-dynamic';

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const { data, error } = await apiFetchSafe<{ client: Client | null }>(
    `/clients/${id}`,
    { client: null },
    { server: true, token: session?.apiToken },
  );

  if (error) {
    return (
      <div className="space-y-6">
        <BackLink />
        <EmptyState tone="warning" title="Can't reach the API" description={error} />
      </div>
    );
  }

  if (!data.client) notFound();
  const c = data.client;

  return (
    <div className="space-y-8">
      <BackLink />

      <header className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <Avatar name={c.name} src={c.avatar ?? undefined} size="xl" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{c.name}</h1>
              {!c.active ? <Badge tone="warning">Archived</Badge> : <Badge tone="success">Active</Badge>}
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted">
              {c.country ? <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {c.country}</span> : null}
              {c.timezone ? <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {c.timezone}</span> : null}
              {c.source ? <Badge>{c.source}</Badge> : null}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {c.whatsapp ? (
            <Button asChild variant="outline">
              <a href={whatsappLink(c.whatsapp)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </Button>
          ) : null}
          {c.emails[0] ? (
            <Button asChild variant="outline">
              <a href={`mailto:${c.emails[0].address}`}>
                <Mail className="h-4 w-4" /> Email
              </a>
            </Button>
          ) : null}
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Active projects" value={String(c.activeProjectCount)} />
        <Stat label="Lifetime value" value={formatCurrency(c.lifetimeValue)} />
        <Stat label="Last activity" value={formatDate(c.lastActivityAt)} />
        <Stat label="Joined" value={formatDate(c.createdAt)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Contact</CardTitle>
            <CardDescription>Multiple emails supported.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <div className="text-xs uppercase tracking-wider text-subtle">Emails</div>
              <ul className="mt-2 space-y-2">
                {c.emails.map((e) => (
                  <li key={e.address} className="flex items-center justify-between gap-2 rounded-lg border border-app bg-elev px-3 py-2">
                    <div className="min-w-0">
                      <div className="truncate">{e.address}</div>
                      {e.label ? <div className="text-xs text-subtle">{e.label}</div> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      {e.primary ? <Badge tone="brand">Primary</Badge> : null}
                      <a href={`mailto:${e.address}`} className="rounded-md p-1 text-subtle hover:text-body" aria-label="Copy">
                        <Copy className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <Row icon={Phone} label="Phone" value={c.phone} />
            <Row icon={MessageCircle} label="WhatsApp" value={c.whatsapp} />
            <Row icon={MapPin} label="Address" value={c.address} />
            <div>
              <div className="text-xs uppercase tracking-wider text-subtle">Notes</div>
              <div className="mt-2 whitespace-pre-wrap rounded-lg border border-app bg-elev p-3 text-sm text-body">
                {c.notes || <span className="text-subtle">No notes yet.</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>All past and active projects for this client.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed border-app p-8 text-center text-sm text-muted">
                No projects linked yet — coming in the next slice.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Edit client</CardTitle>
              <CardDescription>Update details or archive the client.</CardDescription>
            </CardHeader>
            <CardContent>
              <ClientEditForm client={c} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link href="/admin/clients" className="inline-flex items-center gap-2 text-sm text-muted hover:text-body">
      <ArrowLeft className="h-4 w-4" /> All clients
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-app bg-card p-5">
      <div className="text-xs uppercase tracking-wider text-subtle">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-subtle">{label}</div>
      <div className="mt-2 inline-flex items-center gap-2 text-body">
        <Icon className="h-4 w-4 text-subtle" />
        {value || <span className="text-subtle">—</span>}
      </div>
    </div>
  );
}
