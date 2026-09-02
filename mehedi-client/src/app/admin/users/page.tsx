import { getSession } from '@/lib/session';
import { apiFetchSafe } from '@/lib/api';
import { EmptyState } from '@/components/ui/empty-state';
import type { User } from '@/shared';
import { UsersList } from './users-list';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const session = await getSession();
  const { data, error } = await apiFetchSafe<{ users: User[] }>(
    '/users',
    { users: [] },
    { server: true, token: session?.apiToken },
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="mt-2 text-muted">
          {data.users.length} registered {data.users.length === 1 ? 'account' : 'accounts'} that
          haven&apos;t become a client yet.
        </p>
      </div>

      {error ? (
        <EmptyState tone="warning" title="Can't reach the API" description={error} />
      ) : data.users.length === 0 ? (
        <EmptyState title="No users yet" description="New sign-ups without an order show up here." />
      ) : (
        <UsersList initial={data.users} />
      )}
    </div>
  );
}
