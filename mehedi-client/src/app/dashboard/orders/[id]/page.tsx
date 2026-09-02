import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getSession } from '@/lib/session';
import { apiFetchSafe } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ProgressBar } from '@/components/ui/progress-bar';
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

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const { data, error } = await apiFetchSafe<{ order: Order | null }>(
    `/orders/${id}`,
    { order: null },
    { server: true, token: session?.apiToken },
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/dashboard/orders" className="inline-flex items-center gap-2 text-sm text-muted hover:text-body">
        <ArrowLeft className="h-4 w-4" /> My orders
      </Link>

      {error || !data.order ? (
        <EmptyState tone="warning" title="Order not found" description={error ?? undefined} />
      ) : (
        <Card>
          <CardHeader className="items-center text-center">
            <p className="text-sm text-muted">Tracking code</p>
            <p className="font-mono text-3xl font-bold tracking-tight">{data.order.orderCode}</p>
            <Badge tone={STATUS_TONE[data.order.status]} className="mt-2">
              {data.order.status.replace('_', ' ')}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4 border-t border-app pt-5 text-sm">
            <ProgressBar value={data.order.progress} />
            <div className="flex flex-wrap gap-2">
              <Badge>{data.order.serviceType}</Badge>
              <Badge>{data.order.budgetRange}</Badge>
              <Badge>{data.order.timeline}</Badge>
            </div>
            <p className="whitespace-pre-wrap text-body">{data.order.description}</p>
            {data.order.projectUrl ? (
              <a
                href={data.order.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-brand-400 hover:underline"
              >
                View project →
              </a>
            ) : null}
            <p className="text-xs text-subtle">Placed {formatDate(data.order.createdAt)}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
