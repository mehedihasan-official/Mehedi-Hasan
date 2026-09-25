"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label, Textarea } from "@/components/ui/input";
import { useSession } from "@/hooks/use-session";
import { apiFetch } from "@/lib/api";
import type { Order } from "@/shared";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Message = {
  id: string;
  projectId: string;
  body: string;
  createdAt: string;
};
export default function MessagesPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [orderId, setOrderId] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  useEffect(() => {
    if (!session?.apiToken) return;
    Promise.all([
      apiFetch<{ orders: Order[] }>("/orders", { token: session.apiToken }),
      apiFetch<{ messages: Message[] }>("/messages", {
        token: session.apiToken,
      }),
    ])
      .then(([orderResponse, messageResponse]) => {
        setOrders(
          orderResponse.orders.filter(
            (order) => !["delivered", "cancelled"].includes(order.status),
          ),
        );
        setMessages(messageResponse.messages);
      })
      .catch((err) =>
        toast.error(
          err instanceof Error ? err.message : "Unable to load messages",
        ),
      );
  }, [session?.apiToken]);
  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (!orderId || !body.trim())
      return toast.error("Choose an active order and write a message");
    setSending(true);
    try {
      const response = await apiFetch<{ message: Message }>("/messages", {
        method: "POST",
        body: JSON.stringify({ projectId: orderId, body }),
        token: session?.apiToken ?? null,
      });
      setMessages([...messages, response.message]);
      setBody("");
      toast.success("Message sent to the admin");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Message failed");
    } finally {
      setSending(false);
    }
  }
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="mt-2 text-muted">
          Send a question or update directly to the admin.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Contact the admin</CardTitle>
          <CardDescription>
            Choose the order this message is about.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={send} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message-order">Order</Label>
              <select
                id="message-order"
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
                className="flex h-10 w-full rounded-lg border border-app bg-card px-3 py-2 text-sm text-body"
              >
                <option value="">Select an active order</option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.orderCode} · {order.serviceType.replace("_", " ")} ·{" "}
                    {order.status.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message-body">Message</Label>
              <Textarea
                id="message-body"
                rows={6}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Tell the admin what you need help with..."
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={sending}>
                <Send className="h-4 w-4" />
                {sending ? "Sending…" : "Send message"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sent messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {messages.length ? (
            messages.map((message) => (
              <div
                key={message.id}
                className="rounded-xl border border-app p-4"
              >
                <p className="whitespace-pre-wrap text-sm text-body">
                  {message.body}
                </p>
                <p className="mt-2 text-xs text-muted">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">
              Your sent messages will appear here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
