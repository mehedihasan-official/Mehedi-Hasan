import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ProgressBar } from "@/components/ui/progress-bar";
import { apiFetchSafe } from "@/lib/api";
import { getSession } from "@/lib/session";
import { formatCurrency, formatDate, whatsappLink } from "@/lib/utils";
import type { Invoice, Order } from "@/shared";
import { ArrowLeft, MessageCircle, Plus } from "lucide-react";
import Link from "next/link";
import { CopyOrderCode, OrderConversation } from "./order-conversation";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<
  Order["status"],
  "neutral" | "brand" | "success" | "warning" | "danger"
> = {
  pending: "neutral",
  reviewing: "brand",
  accepted: "brand",
  in_progress: "warning",
  delivered: "success",
  cancelled: "danger",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const [{ data, error }, { data: invoiceData }] = await Promise.all([
    apiFetchSafe<{ order: Order | null }>(
      `/orders/${id}`,
      { order: null },
      { server: true, token: session?.apiToken },
    ),
    apiFetchSafe<{ invoices: Invoice[] }>(
      `/invoices?orderId=${encodeURIComponent(id)}`,
      { invoices: [] },
      { server: true, token: session?.apiToken },
    ),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/dashboard/orders"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-body"
      >
        <ArrowLeft className="h-4 w-4" /> My orders
      </Link>

      {error || !data.order ? (
        <EmptyState
          tone="warning"
          title="Order not found"
          description={error ?? undefined}
        />
      ) : (
        <>
          <section className="space-y-5 rounded-xl border border-app bg-card p-5 sm:p-6">
            <header className="flex flex-wrap items-start justify-between gap-4 border-b border-app pb-5">
              <div>
                <p className="text-sm text-muted">Order ID</p>
                <div className="mt-1 flex items-center gap-1">
                  <h1 className="font-mono text-2xl font-bold tracking-tight">
                    {data.order.orderCode}
                  </h1>
                  <CopyOrderCode code={data.order.orderCode} />
                </div>
                <p className="mt-2 text-sm text-muted">
                  Placed {formatDate(data.order.createdAt)}
                </p>
              </div>
              <Badge tone={STATUS_TONE[data.order.status]}>
                {data.order.status.replace("_", " ")}
              </Badge>
            </header>

            <div className="grid gap-4 sm:grid-cols-2">
              <Detail
                label="Order name"
                value={data.order.serviceType.replaceAll("_", " ")}
              />
              <Detail
                label="Order owner"
                value={data.order.clientName ?? session?.user.name ?? "—"}
              />
              <Detail
                label="Deadline / time"
                value={data.order.timeline.replaceAll("_", " ")}
              />
              <Detail
                label="Project budget"
                value={
                  data.order.budgetAmount != null
                    ? formatCurrency(data.order.budgetAmount)
                    : data.order.budgetRange.replaceAll("_", " ")
                }
              />
              <Detail
                label="Project structure"
                value={
                  data.order.projectType === "milestone"
                    ? "Milestone based"
                    : "Single project"
                }
              />
            </div>

            <div className="space-y-2 border-t border-app pt-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Progress</span>
                <span className="text-muted">{data.order.progress}%</span>
              </div>
              <ProgressBar value={data.order.progress} />
            </div>

            <div className="space-y-2 border-t border-app pt-4">
              <h2 className="font-semibold">Project description</h2>
              <p className="whitespace-pre-wrap text-sm leading-6 text-body">
                {data.order.description}
              </p>
            </div>

            {data.order.projectType === "milestone" &&
            data.order.milestones.length > 0 ? (
              <div className="space-y-3 border-t border-app pt-4">
                <h2 className="font-semibold">Milestones</h2>
                {data.order.milestones.map((milestone, index) => (
                  <article
                    key={`${milestone.name}-${index}`}
                    className="rounded-lg border border-app p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="font-medium">
                        {index + 1}. {milestone.name}
                      </h3>
                      <Badge>{milestone.deadlineOrDuration}</Badge>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted">
                      {milestone.description}
                    </p>
                  </article>
                ))}
              </div>
            ) : null}

            {data.order.projectUrl ? (
              <a
                href={data.order.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-brand-400 hover:underline"
              >
                View project link →
              </a>
            ) : null}
            <p className="border-t border-app pt-4 text-xs text-subtle">
              Order submitted {formatDate(data.order.createdAt)}
            </p>
          </section>

          {invoiceData.invoices[0] ? (
            <Card>
              <CardHeader>
                <p className="text-sm text-muted">Invoice</p>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-mono text-lg font-semibold">
                    {invoiceData.invoices[0].number}
                  </h2>
                  <Badge>{invoiceData.invoices[0].status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {invoiceData.invoices[0].amount > 0 ? (
                  <p>
                    Total:{" "}
                    <strong>
                      {formatCurrency(
                        invoiceData.invoices[0].amount,
                        invoiceData.invoices[0].currency,
                      )}
                    </strong>
                  </p>
                ) : null}
                {invoiceData.invoices[0].status === "draft" ? (
                  <p className="text-muted">
                    {invoiceData.invoices[0].amount > 0
                      ? "Your invoice is being prepared."
                      : "The project price is being confirmed."}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <a href="#order-conversation">
                <Plus className="h-4 w-4" /> Request additional work
              </a>
            </Button>
            {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ? (
              <Button asChild variant="outline">
                <a
                  href={whatsappLink(
                    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
                    `Hi, I have a question about order ${data.order.orderCode}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </Button>
            ) : null}
          </div>

          <OrderConversation orderId={data.order.id} />
        </>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-muted">{label}</p>
      <p className="mt-1 capitalize text-body">{value}</p>
    </div>
  );
}
