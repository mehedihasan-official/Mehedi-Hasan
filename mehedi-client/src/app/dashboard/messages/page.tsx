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
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Message = {
  id: string;
  projectId: string;
  fromUserId: string;
  senderName: string;
  projectCode: string;
  projectService?: string | null;
  body: string;
  createdAt: string;
  unread: boolean;
};

type ConversationSummary = {
  projectId: string;
  projectCode: string;
  projectService?: string | null;
  latestBody: string;
  latestAt: string;
  unread: boolean;
  messageCount: number;
};
export default function MessagesPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unread, setUnread] = useState(0);
  const [orderId, setOrderId] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  useEffect(() => {
    if (!session?.apiToken) return;
    Promise.all([
      apiFetch<{ orders: Order[] }>("/orders", { token: session.apiToken }),
      apiFetch<{ unread: number; messages: Message[] }>("/messages", {
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
        setUnread(messageResponse.unread);
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
      await apiFetch<{ message: Message }>("/messages", {
        method: "POST",
        body: JSON.stringify({ projectId: orderId, body }),
        token: session?.apiToken ?? null,
      });
      const refreshed = await apiFetch<{ unread: number; messages: Message[] }>(
        "/messages",
        {
          token: session?.apiToken ?? null,
        },
      );
      setMessages(refreshed.messages);
      setUnread(refreshed.unread);
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
          <CardTitle>Conversation history</CardTitle>
          <CardDescription>
            {unread} unread message{unread === 1 ? "" : "s"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {messages.length ? (
            groupConversations(messages).map((conversation) => (
              <Link
                key={conversation.projectId}
                href={`/dashboard/messages/${conversation.projectId}`}
                className="block rounded-xl border border-app p-4 transition-colors hover:border-strong"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-body">
                      {conversation.projectCode}
                    </p>
                    <p className="text-xs text-muted">
                      {conversation.projectService?.replace("_", " ")} ·{" "}
                      {conversation.messageCount} message
                      {conversation.messageCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  {conversation.unread ? (
                    <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                      NEW
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 line-clamp-2 whitespace-pre-wrap text-sm text-body">
                  {conversation.latestBody}
                </p>
                <p className="mt-2 text-xs text-muted">
                  {new Date(conversation.latestAt).toLocaleString()}
                </p>
              </Link>
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

function groupConversations(messages: Message[]): ConversationSummary[] {
  const groups = new Map<string, Message[]>();
  for (const message of messages)
    groups.set(message.projectId, [
      ...(groups.get(message.projectId) ?? []),
      message,
    ]);
  return [...groups.values()]
    .map((group) => {
      const latest = [...group].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];
      return {
        projectId: latest.projectId,
        projectCode: latest.projectCode,
        projectService: latest.projectService,
        latestBody: latest.body,
        latestAt: latest.createdAt,
        unread: group.some((message) => message.unread),
        messageCount: group.length,
      };
    })
    .sort(
      (a, b) => new Date(b.latestAt).getTime() - new Date(a.latestAt).getTime(),
    );
}
