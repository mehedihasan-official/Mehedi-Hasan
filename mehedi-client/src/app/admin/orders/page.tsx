import { getSession } from '@/lib/session';
import { apiFetchSafe } from '@/lib/api';
import { EmptyState } from '@/components/ui/empty-state';
import type { Order } from '@/shared';
import { OrdersList } from './orders-list';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const session = await getSession();
  const { data, error } = await apiFetchSafe<{ orders: Order[] }>(
    '/orders',
    { orders: [] },
    { server: true, token: session?.apiToken },
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="mt-2 text-muted">
          {data.orders.length} {data.orders.length === 1 ? 'order' : 'orders'} placed by clients.
        </p>
      </div>

      {error ? (
        <EmptyState tone="warning" title="Can't reach the API" description={error} />
      ) : data.orders.length === 0 ? (
        <EmptyState title="No orders yet" description="They'll show up here as soon as a client places one." />
      ) : (
        <OrdersList initial={data.orders} />
      )}
    </div>
  );
}
