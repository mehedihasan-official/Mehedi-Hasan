'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { Client } from '@mehedi/shared';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';

export function ClientsGrid({ initial }: { initial: Client[] }) {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return initial;
    return initial.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.emails.some((e) => e.address.toLowerCase().includes(s)) ||
        (c.notes ?? '').toLowerCase().includes(s),
    );
  }, [initial, q]);

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search clients by name, email, or note…"
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-app bg-card p-12 text-center">
          <p className="text-body">No clients found.</p>
          <p className="mt-1 text-sm text-muted">Try a different search, or add a new client.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((c) => (
            <ClientCard key={c.id} client={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function ClientCard({ client }: { client: Client }) {
  const primary = client.emails.find((e) => e.primary) ?? client.emails[0];
  return (
    <Link
      href={`/admin/clients/${client.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-app bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-strong hover:shadow-card"
    >
      <div className="flex items-start gap-3">
        <Avatar name={client.name} src={client.avatar ?? undefined} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate font-semibold text-body">{client.name}</div>
            {!client.active ? <Badge tone="warning">Archived</Badge> : null}
          </div>
          <div className="truncate text-xs text-muted">{primary?.address}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-subtle">Active projects</div>
          <div className="mt-1 text-body">{client.activeProjectCount}</div>
        </div>
        <div>
          <div className="text-subtle">Lifetime</div>
          <div className="mt-1 text-body">{formatCurrency(client.lifetimeValue)}</div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-app pt-3 text-xs text-subtle">
        <span>{client.country ?? '—'}</span>
        <span>Last: {formatDate(client.lastActivityAt)}</span>
      </div>
    </Link>
  );
}
