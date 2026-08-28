'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { clientUpdateSchema, type Client, type ClientUpdateInput } from '@/shared';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { apiFetch } from '@/lib/api';

export function ClientEditForm({ client }: { client: Client }) {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ClientUpdateInput>({
    resolver: zodResolver(clientUpdateSchema),
    defaultValues: {
      name: client.name,
      phone: client.phone ?? '',
      whatsapp: client.whatsapp ?? '',
      country: client.country ?? '',
      timezone: client.timezone ?? '',
      address: client.address ?? '',
      notes: client.notes ?? '',
      emails: client.emails,
      active: client.active,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'emails' });
  const emails = watch('emails') ?? [];

  async function onSubmit(values: ClientUpdateInput) {
    try {
      await apiFetch(`/clients/${client.id}`, {
        method: 'PATCH',
        body: JSON.stringify(values),
        token: session?.apiToken ?? null,
      });
      toast.success('Client updated');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    }
  }

  async function archive() {
    if (!confirm('Archive this client? You can restore them later.')) return;
    try {
      await apiFetch(`/clients/${client.id}`, {
        method: 'DELETE',
        token: session?.apiToken ?? null,
      });
      toast.success('Client archived');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Archive failed');
    }
  }

  function setPrimary(index: number) {
    const next = emails.map((e, i) => ({ ...e, primary: i === index }));
    setValue('emails', next, { shouldDirty: true });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input {...register('name')} />
          {errors.name ? <p className="text-xs text-red-400">{errors.name.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label>Country</Label>
          <Input placeholder="United States" {...register('country')} />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input placeholder="+1 …" {...register('phone')} />
        </div>
        <div className="space-y-2">
          <Label>WhatsApp</Label>
          <Input placeholder="+1 …" {...register('whatsapp')} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Address</Label>
          <Input {...register('address')} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Notes</Label>
          <Textarea rows={4} {...register('notes')} />
        </div>
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
        <div className="space-y-2">
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
              <Button type="button" size="icon" variant="ghost" onClick={() => remove(i)} aria-label="Remove">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-app pt-6">
        <Button type="button" variant="danger" onClick={archive} disabled={!client.active}>
          {client.active ? 'Archive client' : 'Archived'}
        </Button>
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
