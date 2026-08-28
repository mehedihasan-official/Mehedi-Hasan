'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { clientCreateSchema, type Client, type ClientCreateInput } from '@mehedi/shared';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { apiFetch } from '@/lib/api';

export default function NewClientPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClientCreateInput>({
    resolver: zodResolver(clientCreateSchema),
    defaultValues: {
      name: '',
      emails: [{ address: '', primary: true, label: '' }],
      phone: '',
      whatsapp: '',
      country: '',
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'emails' });
  const emails = watch('emails') ?? [];

  function setPrimary(index: number) {
    setValue(
      'emails',
      emails.map((e, i) => ({ ...e, primary: i === index })),
      { shouldDirty: true },
    );
  }

  async function onSubmit(values: ClientCreateInput) {
    try {
      const res = await apiFetch<{ client: Client; inviteToken: string }>('/clients', {
        method: 'POST',
        body: JSON.stringify(values),
        token: session?.apiToken ?? null,
      });
      toast.success(`${res.client.name} added — invite token generated.`);
      router.push(`/admin/clients/${res.client.id}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create client');
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/admin/clients" className="inline-flex items-center gap-2 text-sm text-muted hover:text-body">
        <ArrowLeft className="h-4 w-4" /> All clients
      </Link>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New client</h1>
        <p className="mt-2 text-muted">Add a client manually. Their invite email flow ships next slice.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl border border-app bg-card p-6">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input placeholder="Jane Doe" {...register('name')} />
          {errors.name ? <p className="text-xs text-red-400">{errors.name.message}</p> : null}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Emails</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => append({ address: '', primary: false, label: '' })}
            >
              <Plus className="h-3.5 w-3.5" /> Add email
            </Button>
          </div>
          {fields.map((f, i) => (
            <div key={f.id} className="flex items-center gap-2">
              <Input placeholder="name@company.com" {...register(`emails.${i}.address` as const)} />
              <Input placeholder="Label (optional)" className="max-w-40" {...register(`emails.${i}.label` as const)} />
              <Button
                type="button"
                size="sm"
                variant={emails[i]?.primary ? 'default' : 'outline'}
                onClick={() => setPrimary(i)}
              >
                {emails[i]?.primary ? 'Primary' : 'Set primary'}
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => remove(i)}
                aria-label="Remove"
                disabled={fields.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input placeholder="+1 …" {...register('phone')} />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp</Label>
            <Input placeholder="+1 …" {...register('whatsapp')} />
          </div>
          <div className="space-y-2">
            <Label>Country</Label>
            <Input placeholder="United States" {...register('country')} />
          </div>
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Input placeholder="America/New_York" {...register('timezone')} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea rows={4} placeholder="Internal notes…" {...register('notes')} />
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-app pt-4">
          <Button asChild variant="ghost">
            <Link href="/admin/clients">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating…' : 'Create client'}
          </Button>
        </div>
      </form>
    </div>
  );
}
