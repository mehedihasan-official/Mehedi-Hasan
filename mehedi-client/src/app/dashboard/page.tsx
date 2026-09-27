import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { apiFetchSafe } from "@/lib/api";
import { getSession } from "@/lib/session";
import { formatDate } from "@/lib/utils";
import type { Invoice, Order } from "@/shared";
import { ArrowRight, MessageCircle, Package } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type DashboardMessage = { unread: boolean };

export default async function ClientDashboardPage() {
  const session = await getSession();
  const name = session?.user?.name?.split(" ")[0] ?? "there";

  const [{ data }, { data: messageData }, { data: invoiceData }] =
    await Promise.all([
      apiFetchSafe<{ orders: Order[] }>(
        "/orders?limit=100",
        { orders: [] },
        { server: true, token: session?.apiToken },
      ),
      apiFetchSafe<{ unread: number; messages: DashboardMessage[] }>(
        "/messages",
        { unread: 0, messages: [] },
        { server: true, token: session?.apiToken },
      ),
      apiFetchSafe<{ invoices: Invoice[] }>(
        "/invoices",
        { invoices: [] },
        { server: true, token: session?.apiToken },
      ),
    ]);
  const active = data.orders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status),
  );
  const history = data.orders.filter((o) =>
    ["delivered", "cancelled"].includes(o.status),
  );
  const tone = (status: Order["status"]) =>
    status === "delivered"
      ? "success"
      : status === "cancelled"
        ? "danger"
        : status === "in_progress"
          ? "warning"
          : "brand";
  const openInvoices = invoiceData.invoices.filter(
    (invoice) => invoice.status !== "paid",
  );
  const averageProgress = active.length
    ? Math.round(
        active.reduce((total, order) => total + order.progress, 0) /
          active.length,
      )
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back, {name}
        </h1>
        <p className="mt-2 text-sm text-muted sm:text-base">
          Your projects, messages, and invoices in one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/messages"
          className="group flex items-center gap-4 rounded-2xl border border-app bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-strong hover:shadow-card"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-brand text-white">
            <MessageCircle className="h-6 w-6" />
          </span>
          <div>
            <div className="font-semibold text-body">Message the admin</div>
            <div className="text-sm text-muted">
              Ask a question about an active order.
            </div>
          </div>
        </Link>
        <Link
          href="/dashboard/orders/new"
          className="group flex items-center gap-4 rounded-2xl border border-app bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-strong hover:shadow-card"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-brand text-white">
            <Package className="h-6 w-6" />
          </span>
          <div>
            <div className="font-semibold text-body">Place an order</div>
            <div className="text-sm text-muted">
              Fill a quick form and get a tracking code.
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {[
          {
            k: "Active orders",
            v: String(active.length),
            href: "/dashboard/orders",
          },
          {
            k: "Completed",
            v: String(history.length),
            href: "/dashboard/orders",
          },
          {
            k: "Unread messages",
            v: String(messageData.unread),
            href: "/dashboard/messages",
          },
          {
            k: "Open invoices",
            v: String(openInvoices.length),
            href: "/dashboard/invoices",
          },
        ].map((item) => (
          <Link key={item.k} href={item.href ?? "#"} className="block min-w-0">
            <Card className="h-full transition-colors hover:border-strong">
              <CardHeader className="p-4 sm:p-6">
                <CardDescription className="text-xs sm:text-sm">
                  {item.k}
                </CardDescription>
                <CardTitle className="text-2xl sm:text-3xl">{item.v}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 p-4 sm:p-6">
          <div>
            <CardTitle>Project progress</CardTitle>
            <CardDescription>
              Average completion across {active.length} active{" "}
              {active.length === 1 ? "order" : "orders"}.
            </CardDescription>
          </div>
          <Link
            href="/dashboard/orders"
            className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-brand-400"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent className="space-y-4 px-4 pb-4 pt-0 sm:px-6 sm:pb-6">
          <div className="flex items-center gap-3">
            <ProgressBar value={averageProgress} />
            <span className="w-10 shrink-0 text-right text-sm font-semibold">
              {averageProgress}%
            </span>
          </div>
          {active.length ? (
            <div className="divide-y divide-app">
              {active.slice(0, 4).map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  tone={tone(order.status)}
                  showProgress
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-app p-4 text-sm text-muted">
              Place an order to see its status and progress here.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completed history</CardTitle>
          <CardDescription>
            Finished and cancelled orders stay here for reference.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {history.length ? (
            <div className="space-y-3">
              {history.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  tone={tone(order.status)}
                />
              ))}
            </div>
          ) : (
            <EmptyList text="Completed orders will appear here." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OrderRow({
  order,
  tone,
  showProgress = false,
}: {
  order: Order;
  tone: "brand" | "success" | "warning" | "danger";
  showProgress?: boolean;
}) {
  return (
    <Link
      href={`/dashboard/orders/${order.id}`}
      className="flex min-w-0 items-center justify-between gap-3 py-4 transition-colors hover:text-brand-400"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-mono text-sm font-semibold text-body">
            {order.orderCode}
          </p>
          <Badge tone={tone}>{order.status.replace("_", " ")}</Badge>
        </div>
        <p className="mt-1 truncate text-xs capitalize text-muted">
          {order.serviceType.replaceAll("_", " ")} ·{" "}
          {formatDate(order.createdAt)}
        </p>
        {showProgress ? (
          <div className="mt-3">
            <ProgressBar value={order.progress} />
          </div>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <ArrowRight className="h-4 w-4 text-muted" />
      </div>
    </Link>
  );
}

function EmptyList({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-app p-6 text-center text-sm text-muted">
      {text}
    </div>
  );
}
