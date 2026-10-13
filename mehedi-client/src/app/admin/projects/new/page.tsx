'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { BUDGET_RANGES, SERVICE_TYPES, TIMELINES, manualOrderCreateSchema, type ManualOrderCreateInput, type Order } from '@/shared';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { useSession } from '@/hooks/use-session';
import { apiFetch } from '@/lib/api';

const selectClassName =
  'flex h-10 w-full rounded-lg border border-app bg-elev px-3 text-sm text-body focus:outline-none focus:ring-2 focus:ring-[var(--ring)]';

function formatOption(value: string) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function StartProjectPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ManualOrderCreateInput>({
    resolver: zodResolver(manualOrderCreateSchema),
    defaultValues: {
      projectName: '',
      clientName: '',
      clientEmail: '',
      clientWhatsapp: '',
      serviceType: 'other',
      budgetRange: 'not_sure',
      budgetAmount: null,
      timeline: 'flexible',
      projectType: 'single',
      milestones: [],
      description: '',
      projectUrl: '',
      links: {
        live: '',
        staging: '',
        repo: '',
        figma: '',
        docs: '',
        sharedFolder: '',
      },
      internalInfo: '',
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'milestones' });
  const projectType = watch('projectType');

  async function onSubmit(values: ManualOrderCreateInput) {
    try {
      const result = await apiFetch<{ order: Order }>('/orders/manual', {
        method: 'POST',
        body: JSON.stringify(values),
        token: session?.apiToken ?? null,
      });
      toast.success('Project started');
      router.push(`/admin/orders/${result.order.id}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to start project');
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-body"
      >
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Start a project</h1>
        <p className="mt-2 text-muted">
          Create a client record and project together, including work received outside the platform.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-7 rounded-2xl border border-app bg-card p-5 sm:p-6"
      >
        <section className="space-y-4">
          <h2 className="font-semibold text-body">Client</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client name</Label>
              <Input id="clientName" autoComplete="name" maxLength={120} {...register('clientName')} />
              {errors.clientName ? <p className="text-xs text-red-400">{errors.clientName.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email address</Label>
              <Input id="clientEmail" type="email" autoComplete="email" maxLength={254} {...register('clientEmail')} />
              {errors.clientEmail ? <p className="text-xs text-red-400">{errors.clientEmail.message}</p> : null}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="clientWhatsapp">WhatsApp (optional)</Label>
              <Input id="clientWhatsapp" type="tel" autoComplete="tel" maxLength={30} {...register('clientWhatsapp')} />
            </div>
          </div>
        </section>

        <section className="space-y-4 border-t border-app pt-6">
          <h2 className="font-semibold text-body">Project details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="projectName">Project name</Label>
              <Input id="projectName" maxLength={200} {...register('projectName')} />
              {errors.projectName ? <p className="text-xs text-red-400">{errors.projectName.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service</Label>
              <select id="serviceType" className={selectClassName} {...register('serviceType')}>
                {SERVICE_TYPES.map((item) => <option key={item} value={item}>{formatOption(item)}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline</Label>
              <select id="timeline" className={selectClassName} {...register('timeline')}>
                {TIMELINES.map((item) => <option key={item} value={item}>{formatOption(item)}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetRange">Budget range</Label>
              <select id="budgetRange" className={selectClassName} {...register('budgetRange')}>
                {BUDGET_RANGES.map((item) => <option key={item} value={item}>{formatOption(item)}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetAmount">Agreed amount (USD, optional)</Label>
              <Input
                id="budgetAmount"
                type="number"
                min={0}
                step="0.01"
                {...register('budgetAmount', {
                  setValueAs: (value) => value === '' ? null : Number(value),
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectType">Project structure</Label>
              <select id="projectType" className={selectClassName} {...register('projectType')}>
                <option value="single">Single project</option>
                <option value="milestone">Milestone based</option>
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Project description</Label>
              <Textarea id="description" rows={5} maxLength={4000} {...register('description')} />
              {errors.description ? <p className="text-xs text-red-400">{errors.description.message}</p> : null}
            </div>
          </div>
        </section>

        {projectType === 'milestone' ? (
          <section className="space-y-4 border-t border-app pt-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-body">Milestones</h2>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => append({ name: '', description: '', deadlineOrDuration: '' })}
              >
                <Plus className="h-3.5 w-3.5" /> Add milestone
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="grid gap-3 rounded-xl border border-app p-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Milestone name</Label>
                  <Input {...register(`milestones.${index}.name`)} />
                  {errors.milestones?.[index]?.name ? (
                    <p className="text-xs text-red-400">{errors.milestones[index]?.name?.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label>Deadline or duration</Label>
                  <Input placeholder="e.g. 1 week" {...register(`milestones.${index}.deadlineOrDuration`)} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Description</Label>
                  <Textarea rows={2} {...register(`milestones.${index}.description`)} />
                </div>
                <div className="sm:col-span-2">
                  <Button type="button" size="sm" variant="ghost" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4" /> Remove milestone
                  </Button>
                </div>
              </div>
            ))}
            {errors.milestones?.root ? <p className="text-xs text-red-400">{errors.milestones.root.message}</p> : null}
            {fields.length === 0 ? <p className="text-sm text-muted">Add at least one milestone to continue.</p> : null}
          </section>
        ) : null}

        <section className="space-y-4 border-t border-app pt-6">
          <h2 className="font-semibold text-body">Project links</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <LinkField id="projectUrl" label="Main project URL" register={register('projectUrl')} />
            <LinkField id="links.live" label="Live site" register={register('links.live')} />
            <LinkField id="links.staging" label="Staging" register={register('links.staging')} />
            <LinkField id="links.repo" label="Source repository" register={register('links.repo')} />
            <LinkField id="links.figma" label="Figma/design" register={register('links.figma')} />
            <LinkField id="links.docs" label="Documentation" register={register('links.docs')} />
            <LinkField id="links.sharedFolder" label="Shared folder" register={register('links.sharedFolder')} />
          </div>
        </section>

        <section className="space-y-2 border-t border-app pt-6">
          <Label htmlFor="internalInfo">Private project information</Label>
          <Textarea
            id="internalInfo"
            rows={5}
            maxLength={8000}
            placeholder="Credentials location (never paste passwords), decisions, reminders, and other admin-only context…"
            {...register('internalInfo')}
          />
          <p className="text-xs text-muted">Only visible in the admin panel.</p>
        </section>

        <div className="flex justify-end gap-3 border-t border-app pt-5">
          <Button asChild variant="ghost"><Link href="/admin/projects">Cancel</Link></Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Starting…' : 'Start project'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function LinkField({
  id,
  label,
  register,
}: {
  id: string;
  label: string;
  register: UseFormRegisterReturn;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type="url" placeholder="https://…" {...register} />
    </div>
  );
}
