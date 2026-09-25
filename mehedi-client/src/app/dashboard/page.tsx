import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiFetchSafe } from "@/lib/api";
import { getSession } from "@/lib/session";
import { formatDate } from "@/lib/utils";
import type { Order } from "@/shared";
import { ArrowRight, MessageCircle, Package } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type DashboardMessage = { unread: boolean };

export default async function ClientDashboardPage() {
  const session = await getSession();
  const name = session?.user?.name?.split(" ")[0] ?? "there";

  const [{ data }, { data: messageData }] = await Promise.all([
    apiFetchSafe<{ orders: Order[] }>(
      "/orders",
      { orders: [] },
      { server: true, token: session?.apiToken },
    ),
    apiFetchSafe<{ unread: number; messages: DashboardMessage[] }>(
      "/messages",
      { unread: 0, messages: [] },
      { server: true, token: session?.apiToken },
    ),
  ]);
  const activeOrders = data.orders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status),
  ).length;
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {name} 👋
        </h1>
        <p className="mt-2 text-muted">
          Here&apos;s a snapshot of your active work.
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            k: "Active orders",
            v: String(activeOrders),
            href: "/dashboard/orders",
          },
          { k: "Next milestone", v: "—" },
          {
            k: "Unread messages",
            v: String(messageData.unread),
            href: "/dashboard/messages",
          },
          { k: "Open invoices", v: "—" },
        ].map((item) => (
          <Link
            key={item.k}
            href={item.href ?? "#"}
            className={item.href ? "block" : "pointer-events-none"}
          >
            <Card
              className={
                item.href ? "transition-colors hover:border-strong" : undefined
              }
            >
              <CardHeader>
                <CardDescription>{item.k}</CardDescription>
                <CardTitle className="text-3xl">{item.v}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active work</CardTitle>
          <CardDescription>
            Current orders and their latest status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {active.length ? (
            <div className="space-y-3">
              {active.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  tone={tone(order.status)}
                />
              ))}
            </div>
          ) : (
            <EmptyList text="No active orders yet." />
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
}: {
  order: Order;
  tone: "brand" | "success" | "warning" | "danger";
}) {
  return (
    <Link
      href={`/dashboard/orders/${order.id}`}
      className="flex items-center justify-between gap-4 rounded-xl border border-app p-4 transition-colors hover:border-strong"
    >
      <div className="min-w-0">
        <p className="truncate font-mono text-sm font-semibold text-body">
          {order.orderCode}
        </p>
        <p className="mt-1 text-xs text-muted">
          {order.serviceType.replace("_", " ")} · {formatDate(order.createdAt)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Badge tone={tone}>{order.status.replace("_", " ")}</Badge>
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
