'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadCreateSchema, type LeadCreateInput } from '@/shared';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { apiFetch } from '@/lib/api';

export default function StartProjectPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadCreateInput>({
    resolver: zodResolver(leadCreateSchema),
    defaultValues: { source: 'contact_form', serviceType: 'web_app', budgetRange: 'not_sure', timeline: 'flexible' },
  });

  async function onSubmit(values: LeadCreateInput) {
    try {
      await apiFetch('/leads', { method: 'POST', body: JSON.stringify(values) });
      toast.success('Got it — I&apos;ll reach out within a day.');
      setSubmitted(true);
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 md:px-6 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full gradient-brand text-white text-3xl font-bold">✓</div>
        <h1 className="mt-8 text-3xl font-bold tracking-tight">Thanks — got your brief.</h1>
        <p className="mt-4 text-muted">
          I&apos;ll read it today and reach out on email or WhatsApp within 24 hours. Talk soon.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6 md:py-24">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Start a project</h1>
      <p className="mt-4 text-muted">A few quick details and I&apos;ll come back to you within a day.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5">
        <Field label="Your name" error={errors.name?.message}>
          <Input placeholder="Jane Doe" {...register('name')} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email" error={errors.email?.message}>
            <Input type="email" placeholder="you@example.com" {...register('email')} />
          </Field>
          <Field label="Phone / WhatsApp (optional)" error={errors.phone?.message}>
            <Input placeholder="+1 555 0000" {...register('phone')} />
          </Field>
        </div>
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
        <Field label="Tell me about the project" error={errors.message?.message}>
          <Textarea rows={6} placeholder="What are you trying to build? Any references or must-haves?" {...register('message')} />
        </Field>

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? 'Sending…' : 'Send brief'}
        </Button>
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
