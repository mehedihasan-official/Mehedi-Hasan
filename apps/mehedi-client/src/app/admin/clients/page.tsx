import Link from 'next/link';
import { Plus } from 'lucide-react';
import { auth } from '@/auth';
import { apiFetch } from '@/lib/api';
import type { Client } from '@mehedi/shared';
import { Button } from '@/components/ui/button';
import { ClientsGrid } from './clients-grid';

export const dynamic = 'force-dynamic';

export default async function AdminClientsPage() {
  const session = await auth();
  const { clients } = await apiFetch<{ clients: Client[] }>('/clients', {
    server: true,
    token: session?.apiToken,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="mt-2 text-muted">
            {clients.length} {clients.length === 1 ? 'client' : 'clients'} — your book of business.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/clients/new">
            <Plus className="h-4 w-4" /> Add client
          </Link>
        </Button>
      </div>

      <ClientsGrid initial={clients} />
    </div>
  );
}
