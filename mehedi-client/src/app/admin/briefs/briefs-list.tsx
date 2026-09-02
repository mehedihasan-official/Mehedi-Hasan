'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Brief } from '@/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/hooks/use-session';

export function BriefsList({ initial }: { initial: Brief[] }) {
  const [briefs, setBriefs] = useState(initial);
  const [startingId, setStartingId] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  async function startOrder(brief: Brief) {
    setStartingId(brief.id);
    try {
      const res = await apiFetch<{ orderId: string }>(`/briefs/${brief.id}/start-order`, {
        method: 'POST',
        token: session?.apiToken ?? null,
      });
      toast.success('Order started');
      setBriefs((cur) =>
        cur.map((b) => (b.id === brief.id ? { ...b, status: 'converted', orderId: res.orderId } : b)),
      );
      router.push(`/admin/orders/${res.orderId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to start order');
    } finally {
      setStartingId(null);
    }
  }

  return (
    <div className="grid gap-4">
      {briefs.map((b) => (
        <Card key={b.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>{b.name}</CardTitle>
                <CardDescription>
                  {b.email} · {formatDate(b.createdAt)}
                </CardDescription>
              </div>
              <Badge tone={b.status === 'new' ? 'brand' : b.status === 'converted' ? 'success' : 'neutral'}>
                {b.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex flex-wrap gap-2">
              <Badge>{b.serviceType}</Badge>
              <Badge>{b.budgetRange}</Badge>
              <Badge>{b.timeline}</Badge>
            </div>
            {b.message ? <p className="whitespace-pre-wrap text-body">{b.message}</p> : null}

            <div className="flex items-center justify-between border-t border-app pt-3">
              {b.orderId ? (
                <Link href={`/admin/orders/${b.orderId}`} className="text-xs text-brand-400 hover:underline">
                  View order →
                </Link>
              ) : b.userId ? (
                <Button size="sm" onClick={() => startOrder(b)} disabled={startingId === b.id}>
                  {startingId === b.id ? 'Starting…' : 'Start order'}
                </Button>
              ) : (
                <span className="text-xs text-subtle">No account linked yet — they need to register first.</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
