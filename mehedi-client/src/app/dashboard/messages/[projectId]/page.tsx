"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { useSession } from "@/hooks/use-session";
import { apiFetch } from "@/lib/api";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

type Message = {
  id: string;
  senderName: string;
  body: string;
  createdAt: string;
};
type Conversation = {
  order: { orderCode: string; serviceType: string };
  messages: Message[];
};

export default function ClientConversationPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const { data: session } = useSession();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  useEffect(() => {
    if (!session?.apiToken) return;
    apiFetch<Conversation>(`/messages/project/${projectId}`, {
      token: session.apiToken,
    })
      .then(setConversation)
      .catch((err) =>
        toast.error(
          err instanceof Error ? err.message : "Unable to load conversation",
        ),
      );
  }, [projectId, session?.apiToken]);
  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    try {
      await apiFetch(`/messages`, {
        method: "POST",
        body: JSON.stringify({ projectId, body }),
        token: session?.apiToken ?? null,
      });
      const next = await apiFetch<Conversation>(
        `/messages/project/${projectId}`,
        { token: session?.apiToken ?? null },
      );
      setConversation(next);
      setBody("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Message failed");
    } finally {
      setSending(false);
    }
  }
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/dashboard/messages"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-body"
      >
        <ArrowLeft className="h-4 w-4" /> Messages
      </Link>
      {conversation ? (
        <>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {conversation.order.orderCode}
            </h1>
            <p className="mt-2 text-muted">
              {conversation.order.serviceType.replace("_", " ")} conversation
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Conversation history</CardTitle>
              <CardDescription>
                Messages with the admin about this order.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {conversation.messages.map((message) => (
                <div
                  key={message.id}
                  className="rounded-xl border border-app p-4"
                >
                  <div className="flex justify-between gap-3">
                    <p className="font-medium text-body">
                      {message.senderName}
                    </p>
                    <time className="text-xs text-muted">
                      {new Date(message.createdAt).toLocaleString()}
                    </time>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-body">
                    {message.body}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reply</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={send} className="space-y-3">
                <Textarea
                  rows={4}
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="Write a reply..."
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={sending || !body.trim()}>
                    <Send className="h-4 w-4" />
                    {sending ? "Sending…" : "Send reply"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </>
      ) : (
        <p className="text-sm text-muted">Loading conversation...</p>
      )}
    </div>
  );
}
