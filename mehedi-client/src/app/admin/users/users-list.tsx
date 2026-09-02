'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { User } from '@/shared';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/hooks/use-session';

export function UsersList({ initial }: { initial: User[] }) {
  const [users, setUsers] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { data: session } = useSession();

  async function toggleBlock(user: User) {
    setBusyId(user.id);
    try {
      await apiFetch(`/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ blocked: !user.blocked }),
        token: session?.apiToken ?? null,
      });
      setUsers((cur) => cur.map((u) => (u.id === user.id ? { ...u, blocked: !u.blocked } : u)));
      toast.success(user.blocked ? 'User unblocked' : 'User blocked — they can no longer log in or re-register with this email');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setBusyId(null);
    }
  }

  async function remove(user: User) {
    if (!confirm(`Remove ${user.name}? This can't be undone.`)) return;
    setBusyId(user.id);
    try {
      await apiFetch(`/users/${user.id}`, { method: 'DELETE', token: session?.apiToken ?? null });
      setUsers((cur) => cur.filter((u) => u.id !== user.id));
      toast.success('User removed');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove user');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="grid gap-3">
      {users.map((u) => {
        const primary = u.emails.find((e) => e.primary) ?? u.emails[0];
        const busy = busyId === u.id;
        return (
          <div
            key={u.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-app bg-card p-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={u.name} src={u.avatar ?? undefined} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium text-body">{u.name}</span>
                  {u.blocked ? <Badge tone="danger">Blocked</Badge> : null}
                </div>
                <div className="truncate text-xs text-muted">{primary?.address}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-subtle">
              <span>Joined {formatDate(u.createdAt)}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => toggleBlock(u)} disabled={busy}>
                  {u.blocked ? 'Unblock' : 'Block'}
                </Button>
                <Button size="sm" variant="danger" onClick={() => remove(u)} disabled={busy}>
                  Remove
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
