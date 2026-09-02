import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getSession } from '@/lib/session';
import { apiFetchSafe } from '@/lib/api';
import type { Client } from '@/shared';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ClientsGrid } from './clients-grid';

export const dynamic = 'force-dynamic';

export default async function AdminClientsPage() {
  const session = await getSession();
  const { data, error } = await apiFetchSafe<{ clients: Client[] }>(
    '/clients',
    { clients: [] },
    { server: true, token: session?.apiToken },
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="mt-2 text-muted">
            {data.clients.length} {data.clients.length === 1 ? 'client' : 'clients'} — your book of business.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/clients/new">
            <Plus className="h-4 w-4" /> Add client
          </Link>
        </Button>
      </div>

      {error ? (
        <EmptyState
          tone="warning"
          title="Can't reach the API"
          description={`${error}. Check that the mehedi-server deployment is live and NEXT_PUBLIC_API_URL is set.`}
        />
      ) : (
        <ClientsGrid initial={data.clients} />
      )}
    </div>
  );
}
