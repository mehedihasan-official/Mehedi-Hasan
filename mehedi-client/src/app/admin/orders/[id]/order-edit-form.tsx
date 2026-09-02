'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ORDER_STATUSES, orderUpdateSchema, type Order, type OrderUpdateInput } from '@/shared';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { ProgressBar } from '@/components/ui/progress-bar';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/hooks/use-session';

export function OrderEditForm({ order }: { order: Order }) {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty },
  } = useForm<OrderUpdateInput>({
    resolver: zodResolver(orderUpdateSchema),
    defaultValues: {
      status: order.status,
      progress: order.progress,
      projectUrl: order.projectUrl ?? '',
      notes: order.notes ?? '',
    },
  });

  const progress = watch('progress') ?? order.progress;

  async function onSubmit(values: OrderUpdateInput) {
    try {
      await apiFetch(`/orders/${order.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ ...values, projectUrl: values.projectUrl || null }),
        token: session?.apiToken ?? null,
      });
      toast.success('Order updated');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Status</Label>
          <select
            className="flex h-10 w-full rounded-lg border border-app bg-elev px-3 text-sm text-body focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            {...register('status')}
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Progress ({progress}%)</Label>
          <Input type="number" min={0} max={100} {...register('progress', { valueAsNumber: true })} />
        </div>
      </div>

      <ProgressBar value={progress ?? 0} />

      <div className="space-y-2">
        <Label>Project link</Label>
        <Input placeholder="https://staging.example.com" {...register('projectUrl')} />
      </div>

      <div className="space-y-2">
        <Label>Internal notes</Label>
        <Textarea rows={5} placeholder="Progress notes, blockers, next steps…" {...register('notes')} />
      </div>

      <div className="flex justify-end border-t border-app pt-4">
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
