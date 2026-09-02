'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { briefCreateSchema, type Brief, type BriefCreateInput } from '@/shared';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { apiFetch } from '@/lib/api';
import { auth } from '@/lib/firebase';
import { exchangeFirebaseSession } from '@/lib/auth-exchange';
import { useSession } from '@/hooks/use-session';

// Matches the temp password the server hands new accounts auto-created
// from a brief submission — see mehedi-server/src/routes/briefs.ts.
const TEMP_PASSWORD = '123456';

export default function StartProjectPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BriefCreateInput>({
    resolver: zodResolver(briefCreateSchema),
    defaultValues: { source: 'contact_form', serviceType: 'web_app', budgetRange: 'not_sure', timeline: 'flexible' },
  });

  async function onSubmit(values: BriefCreateInput) {
    try {
      const res = await apiFetch<{ brief: Brief; accountStatus: 'linked' | 'created' | 'existing' }>(
        '/briefs',
        { method: 'POST', body: JSON.stringify(values), token: session?.apiToken ?? null },
      );

      if (res.accountStatus === 'created') {
        // Brand new account — sign them in with the temp password and send
        // them straight to set a real one.
        const cred = await signInWithEmailAndPassword(auth, values.email, TEMP_PASSWORD);
        await exchangeFirebaseSession(cred.user, values.name);
        toast.success("Got it — I'll reach out within a day.", {
          description: 'Your dashboard is ready — please set a password to secure it.',
          duration: 5000,
        });
        setTimeout(() => router.push('/dashboard/profile?welcome=1'), 1200);
        return;
      }

      if (res.accountStatus === 'existing') {
        toast.success("Got it — I'll reach out within a day.", {
          description: 'This email already has an account — log in to track it from your dashboard.',
          duration: 5000,
        });
        setTimeout(() => router.push('/login?callbackUrl=/dashboard/briefs'), 1200);
        return;
      }

      toast.success("Got it — I'll reach out within a day.", {
        description: 'You can track it from your dashboard.',
        duration: 4000,
      });
      setTimeout(() => router.push('/dashboard/briefs'), 1200);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    }
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
