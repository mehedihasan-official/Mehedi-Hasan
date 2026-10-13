"use client";

import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useSession } from "@/hooks/use-session";
import { apiFetch } from "@/lib/api";
import {
  ORDER_STATUSES,
  orderUpdateSchema,
  type Order,
  type OrderUpdateInput,
} from "@/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
      projectName: order.projectName ?? "",
      status: order.status,
      progress: order.progress,
      budgetAmount: order.budgetAmount ?? null,
      projectUrl: order.projectUrl ?? "",
      links: {
        live: order.links?.live ?? "",
        staging: order.links?.staging ?? "",
        repo: order.links?.repo ?? "",
        figma: order.links?.figma ?? "",
        docs: order.links?.docs ?? "",
        sharedFolder: order.links?.sharedFolder ?? "",
      },
      internalInfo: order.internalInfo ?? "",
      notes: order.notes ?? "",
    },
  });

  const progress = watch("progress") ?? order.progress;

  async function onSubmit(values: OrderUpdateInput) {
    try {
      await apiFetch(`/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...values,
          projectUrl: values.projectUrl || null,
        }),
        token: session?.apiToken ?? null,
      });
      toast.success("Order updated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label>Project name</Label>
          <Input maxLength={200} {...register("projectName")} />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <select
            className="flex h-10 w-full rounded-lg border border-app bg-elev px-3 text-sm text-body focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            {...register("status")}
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Progress ({progress}%)</Label>
          <Input
            type="number"
            min={0}
            max={100}
            {...register("progress", { valueAsNumber: true })}
          />
        </div>
      </div>

      <ProgressBar value={progress ?? 0} />

      <div className="space-y-2">
        <Label>Agreed project amount (USD)</Label>
        <Input
          type="number"
          min={0}
          step="0.01"
          placeholder="Set before approving to price the invoice"
          {...register("budgetAmount", {
            setValueAs: (value) => (value === "" ? null : Number(value)),
          })}
        />
      </div>

      <div className="space-y-2">
        <Label>Main project URL</Label>
        <Input
          type="url"
          placeholder="https://example.com"
          {...register("projectUrl")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Live site</Label>
          <Input type="url" placeholder="https://…" {...register("links.live")} />
        </div>
        <div className="space-y-2">
          <Label>Staging</Label>
          <Input type="url" placeholder="https://…" {...register("links.staging")} />
        </div>
        <div className="space-y-2">
          <Label>Source repository</Label>
          <Input type="url" placeholder="https://…" {...register("links.repo")} />
        </div>
        <div className="space-y-2">
          <Label>Figma / design</Label>
          <Input type="url" placeholder="https://…" {...register("links.figma")} />
        </div>
        <div className="space-y-2">
          <Label>Documentation</Label>
          <Input type="url" placeholder="https://…" {...register("links.docs")} />
        </div>
        <div className="space-y-2">
          <Label>Shared folder</Label>
          <Input type="url" placeholder="https://…" {...register("links.sharedFolder")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Private project information</Label>
        <Textarea
          rows={5}
          maxLength={8000}
          placeholder="Decisions, reminders, where credentials are stored (never paste passwords), and other admin-only context…"
          {...register("internalInfo")}
        />
        <p className="text-xs text-muted">Only visible in the admin panel.</p>
      </div>

      <div className="space-y-2">
        <Label>Internal notes</Label>
        <Textarea
          rows={5}
          placeholder="Progress notes, blockers, next steps…"
          {...register("notes")}
        />
      </div>

      <div className="flex justify-end border-t border-app pt-4">
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
