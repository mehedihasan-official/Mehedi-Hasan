import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getSession } from '@/lib/session';
import { apiFetchSafe } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDate } from '@/lib/utils';
import type { Order } from '@/shared';
import { OrderEditForm } from './order-edit-form';

export const dynamic = 'force-dynamic';

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const { data, error } = await apiFetchSafe<{ order: Order | null }>(
    `/orders/${id}`,
    { order: null },
    { server: true, token: session?.apiToken },
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm text-muted hover:text-body">
        <ArrowLeft className="h-4 w-4" /> All orders
      </Link>

      {error || !data.order ? (
        <EmptyState tone="warning" title="Order not found" description={error ?? undefined} />
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-mono text-3xl font-bold tracking-tight">{data.order.orderCode}</h1>
              <p className="mt-2 text-muted">
                {data.order.clientName ?? 'Unknown client'} · {data.order.clientEmail ?? '—'} · placed{' '}
                {formatDate(data.order.createdAt)}
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>What the client asked for.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex flex-wrap gap-2">
                <Badge>{data.order.serviceType}</Badge>
                <Badge>{data.order.budgetRange}</Badge>
                <Badge>{data.order.timeline}</Badge>
              </div>
              <p className="whitespace-pre-wrap text-body">{data.order.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage order</CardTitle>
              <CardDescription>Status, progress, project link, and internal notes.</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderEditForm order={data.order} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
