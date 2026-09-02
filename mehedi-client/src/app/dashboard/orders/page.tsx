import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getSession } from '@/lib/session';
import { apiFetchSafe } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
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

export default async function OrdersPage() {
  const session = await getSession();
  const { data, error } = await apiFetchSafe<{ orders: Order[] }>(
    '/orders',
    { orders: [] },
    { server: true, token: session?.apiToken },
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My orders</h1>
          <p className="mt-2 text-muted">Track every order you&apos;ve placed.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/orders/new">
            <Plus className="h-4 w-4" /> Place an order
          </Link>
        </Button>
      </div>

      {error ? (
        <EmptyState tone="warning" title="Can't reach the API" description={error} />
      ) : data.orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Place your first order and get a tracking code right away."
        />
      ) : (
        <div className="grid gap-4">
          {data.orders.map((o) => (
            <Link key={o.id} href={`/dashboard/orders/${o.id}`}>
              <Card className="transition-colors hover:border-strong">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="font-mono text-lg">{o.orderCode}</CardTitle>
                      <CardDescription>{formatDate(o.createdAt)}</CardDescription>
                    </div>
                    <Badge tone={STATUS_TONE[o.status]}>{o.status.replace('_', ' ')}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2 text-sm">
                  <Badge>{o.serviceType}</Badge>
                  <Badge>{o.budgetRange}</Badge>
                  <Badge>{o.timeline}</Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
