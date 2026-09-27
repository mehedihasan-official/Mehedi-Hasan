import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { apiFetchSafe } from "@/lib/api";
import { getSession } from "@/lib/session";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice } from "@/shared";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<
  Invoice["status"],
  "neutral" | "brand" | "success" | "warning"
> = {
  draft: "neutral",
  sent: "brand",
  paid: "success",
  overdue: "warning",
};

export default async function InvoicesPage() {
  const session = await getSession();
  const { data, error } = await apiFetchSafe<{ invoices: Invoice[] }>(
    "/invoices",
    { invoices: [] },
    { server: true, token: session?.apiToken },
  );
  const openCount = data.invoices.filter(
    (invoice) => invoice.status !== "paid",
  ).length;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="mt-2 text-muted">
            {data.invoices.length} total · {openCount} awaiting payment or final
            pricing
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/orders/new">
            <Plus className="h-4 w-4" /> Place an order
          </Link>
        </Button>
      </header>

      {error ? (
        <EmptyState
          tone="warning"
          title="Can't reach the API"
          description={error}
        />
      ) : data.invoices.length === 0 ? (
        <>
          <EmptyState
            title="No invoices yet"
            description="An invoice draft is created automatically when you place an order."
          />
          <div className="mt-4 flex justify-center">
            <Button asChild>
              <Link href="/dashboard/orders/new">Place an order</Link>
            </Button>
          </div>
        </>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {data.invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardHeader className="space-y-3 p-4 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="font-mono text-lg">
                      {invoice.number}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Created {formatDate(invoice.createdAt)}
                    </CardDescription>
                  </div>
                  <Badge tone={STATUS_TONE[invoice.status]}>
                    {invoice.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-app pt-3">
                  <div>
                    <p className="text-xs text-muted">Invoice total</p>
                    <p className="mt-1 text-xl font-semibold">
                      {invoice.amount > 0
                        ? formatCurrency(invoice.amount, invoice.currency)
                        : "Price being confirmed"}
                    </p>
                  </div>
                  {invoice.dueDate ? (
                    <p className="text-sm text-muted">
                      Due {formatDate(invoice.dueDate)}
                    </p>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 px-4 pb-4 pt-0 sm:px-6 sm:pb-6">
                <div className="space-y-1">
                  {invoice.items.map((item, index) => (
                    <p
                      key={`${item.description}-${index}`}
                      className="text-sm text-muted"
                    >
                      {item.description}
                    </p>
                  ))}
                </div>
                {invoice.notes ? (
                  <p className="rounded-lg bg-elev p-3 text-sm text-muted">
                    {invoice.notes}
                  </p>
                ) : null}
                {invoice.orderId ? (
                  <Link
                    href={`/dashboard/orders/${invoice.orderId}`}
                    className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-brand-400 hover:underline"
                  >
                    View related order <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
