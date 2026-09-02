'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { orderCreateSchema, type Order, type OrderCreateInput } from '@/shared';
import { Button } from '@/components/ui/button';
import { Label, Textarea } from '@/components/ui/input';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/hooks/use-session';

export default function NewOrderPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderCreateInput>({
    resolver: zodResolver(orderCreateSchema),
    defaultValues: { serviceType: 'web_app', budgetRange: 'not_sure', timeline: 'flexible' },
  });

  async function onSubmit(values: OrderCreateInput) {
    try {
      const res = await apiFetch<{ order: Order }>('/orders', {
        method: 'POST',
        body: JSON.stringify(values),
        token: session?.apiToken ?? null,
      });
      toast.success(`Order placed — tracking code ${res.order.orderCode}`);
      router.push(`/dashboard/orders/${res.order.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to place order');
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/dashboard/orders" className="inline-flex items-center gap-2 text-sm text-muted hover:text-body">
        <ArrowLeft className="h-4 w-4" /> My orders
      </Link>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Place an order</h1>
        <p className="mt-2 text-muted">A few details and you&apos;ll get a tracking code right away.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl border border-app bg-card p-6">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Service">
            <Select {...register('serviceType')}>
              <option value="web_app">Web App</option>
              <option value="mobile_app">Mobile App</option>
              <option value="meta_ads">Meta Ads</option>
              <option value="wordpress">WordPress</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="Budget">
            <Select {...register('budgetRange')}>
              <option value="not_sure">Not sure yet</option>
              <option value="under_500">Under $500</option>
              <option value="500_1500">$500 – $1.5k</option>
              <option value="1500_5000">$1.5k – $5k</option>
              <option value="5000_15000">$5k – $15k</option>
              <option value="15000_plus">$15k+</option>
            </Select>
          </Field>
          <Field label="Timeline">
            <Select {...register('timeline')}>
              <option value="flexible">Flexible</option>
              <option value="asap">ASAP</option>
              <option value="1_2_weeks">1–2 weeks</option>
              <option value="1_month">~1 month</option>
              <option value="2_3_months">2–3 months</option>
            </Select>
          </Field>
        </div>

        <Field label="Tell me about what you need" error={errors.description?.message}>
          <Textarea
            rows={6}
            placeholder="What are you trying to build? Any references or must-haves?"
            {...register('description')}
          />
        </Field>

        <div className="flex items-center justify-end gap-2 border-t border-app pt-4">
          <Button asChild variant="ghost">
            <Link href="/dashboard/orders">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Placing order…' : 'Place order'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

const Select = ({ className = '', ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={`flex h-10 w-full rounded-lg border border-app bg-card px-3 py-2 text-sm text-body focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-1 focus:ring-offset-[var(--bg)] ${className}`}
    {...props}
  />
);
