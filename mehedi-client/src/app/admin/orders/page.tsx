import Link from 'next/link';
import { getSession } from '@/lib/session';
import { apiFetchSafe } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Pagination } from '@/components/ui/pagination';
import { formatDate } from '@/lib/utils';
import type { Order } from '@/shared';

export const dynamic = 'force-dynamic';

const STATUS_TONE: Record<Order['status'], 'neutral' | 'brand' | 'success' | 'warning' | 'danger'> = {
  pending: 'neutral',
  reviewing: 'brand',
  accepted: 'brand',
  in_progress: 'warning',
  delivered: 'success',
  cancelled: 'danger',
};

type OrdersResponse = { orders: Order[]; total: number; page: number; pages: number };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const session = await getSession();
  const { data, error } = await apiFetchSafe<OrdersResponse>(
    `/orders?page=${page}&limit=20`,
    { orders: [], total: 0, page: 1, pages: 1 },
    { server: true, token: session?.apiToken },
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="mt-2 text-muted">
          {data.total} {data.total === 1 ? 'order' : 'orders'} placed by clients.
        </p>
      </div>

      {error ? (
        <EmptyState tone="warning" title="Can't reach the API" description={error} />
      ) : data.orders.length === 0 ? (
        <EmptyState title="No orders yet" description="They'll show up here as soon as a client places one." />
      ) : (
        <>
          <div className="grid gap-4">
            {data.orders.map((o) => (
              <Link key={o.id} href={`/admin/orders/${o.id}`}>
                <Card className="transition-colors hover:border-strong">
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <CardTitle className="font-mono">{o.orderCode}</CardTitle>
                        <CardDescription>
                          {o.clientName ?? 'Unknown client'} · {o.clientEmail ?? '—'} · {formatDate(o.createdAt)}
                        </CardDescription>
                      </div>
                      <Badge tone={STATUS_TONE[o.status]}>{o.status.replace('_', ' ')}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex flex-wrap gap-2">
                      <Badge>{o.serviceType}</Badge>
                      <Badge>{o.budgetRange}</Badge>
                      <Badge>{o.timeline}</Badge>
                    </div>
                    <ProgressBar value={o.progress} />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <Pagination page={data.page} pages={data.pages} basePath="/admin/orders" />
        </>
      )}
    </div>
  );
}
