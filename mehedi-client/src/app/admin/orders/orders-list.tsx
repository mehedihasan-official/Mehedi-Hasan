'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ORDER_STATUSES, type Order } from '@/shared';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/hooks/use-session';

const STATUS_TONE: Record<Order['status'], 'neutral' | 'brand' | 'success' | 'warning' | 'danger'> = {
  pending: 'neutral',
  reviewing: 'brand',
  accepted: 'brand',
  in_progress: 'warning',
  delivered: 'success',
  cancelled: 'danger',
};

export function OrdersList({ initial }: { initial: Order[] }) {
  const [orders, setOrders] = useState(initial);
  const { data: session } = useSession();

  async function updateStatus(id: string, status: Order['status']) {
    const previous = orders;
    setOrders((cur) => cur.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      await apiFetch(`/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
        token: session?.apiToken ?? null,
      });
      toast.success('Order updated');
    } catch (err) {
      setOrders(previous);
      toast.error(err instanceof Error ? err.message : 'Failed to update order');
    }
  }

  return (
    <div className="grid gap-4">
      {orders.map((o) => (
        <Card key={o.id}>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle className="font-mono">{o.orderCode}</CardTitle>
                <CardDescription>
                  {o.clientName ?? 'Unknown client'} · {o.clientEmail ?? '—'} · {formatDate(o.createdAt)}
                </CardDescription>
              </div>
              <select
                value={o.status}
                onChange={(e) => updateStatus(o.id, e.target.value as Order['status'])}
                className="h-9 rounded-lg border border-app bg-elev px-3 text-sm text-body focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={STATUS_TONE[o.status]}>{o.status.replace('_', ' ')}</Badge>
              <Badge>{o.serviceType}</Badge>
              <Badge>{o.budgetRange}</Badge>
              <Badge>{o.timeline}</Badge>
            </div>
            <p className="whitespace-pre-wrap text-body">{o.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
