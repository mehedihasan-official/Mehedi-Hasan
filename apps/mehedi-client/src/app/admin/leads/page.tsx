import { auth } from '@/auth';
import { apiFetch } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import type { Lead } from '@mehedi/shared';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const session = await auth();
  const { leads } = await apiFetch<{ leads: Lead[] }>('/leads', {
    server: true,
    token: session?.apiToken,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <p className="mt-2 text-muted">Inbox from the public Start a Project form.</p>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-app bg-card p-12 text-center text-muted">
          No leads yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {leads.map((l) => (
            <Card key={l.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{l.name}</CardTitle>
                    <CardDescription>{l.email} · {formatDate(l.createdAt)}</CardDescription>
                  </div>
                  <Badge tone={l.status === 'new' ? 'brand' : 'neutral'}>{l.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex flex-wrap gap-2">
                  <Badge>{l.serviceType}</Badge>
                  <Badge>{l.budgetRange}</Badge>
                  <Badge>{l.timeline}</Badge>
                </div>
                {l.message ? <p className="whitespace-pre-wrap text-body">{l.message}</p> : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
