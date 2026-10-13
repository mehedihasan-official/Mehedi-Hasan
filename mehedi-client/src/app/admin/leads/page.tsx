import { getSession } from '@/lib/session';
import { apiFetchSafe } from '@/lib/api';
import { EmptyState } from '@/components/ui/empty-state';
import type { Lead } from '@/shared';
import { LeadsManager } from './leads-manager';

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  const session = await getSession();
  const { data, error } = await apiFetchSafe<{ leads: Lead[] }>(
    '/leads',
    { leads: [] },
    { server: true, token: session?.apiToken },
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <p className="mt-2 text-muted">
          {data.leads.length} {data.leads.length === 1 ? 'email' : 'emails'} collected from account
          logins and manual entries.
        </p>
      </div>

      {error ? (
        <EmptyState tone="warning" title="Can't reach the API" description={error} />
      ) : null}

      <LeadsManager initial={data.leads} />
    </div>
  );
}
