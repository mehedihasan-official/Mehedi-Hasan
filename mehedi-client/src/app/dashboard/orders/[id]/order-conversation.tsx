"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useSession } from "@/hooks/use-session";
import { apiFetch } from "@/lib/api";
import { Clipboard, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Message = {
  id: string;
  senderName: string;
  body: string;
  createdAt: string;
};

type Conversation = { messages: Message[] };

export function CopyOrderCode({ code }: { code: string }) {
  return (
    <button
      type="button"
      title="Copy order ID"
      aria-label="Copy order ID"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          toast.success("Order ID copied");
        } catch {
          toast.error("Unable to copy order ID");
        }
      }}
      className="rounded-md p-2 text-muted transition-colors hover:bg-elev hover:text-body"
    >
      <Clipboard className="h-4 w-4" />
    </button>
  );
}

export function OrderConversation({ orderId }: { orderId: string }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!session?.apiToken) return;
    let active = true;
    apiFetch<Conversation>(`/messages/project/${orderId}`, {
      token: session.apiToken,
    })
      .then((conversation) => {
        if (active) setMessages(conversation.messages);
      })
      .catch((error) =>
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load conversation",
        ),
      )
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [orderId, session?.apiToken]);

  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    try {
      await apiFetch("/messages", {
        method: "POST",
        body: JSON.stringify({ projectId: orderId, body: body.trim() }),
        token: session?.apiToken ?? null,
      });
      const conversation = await apiFetch<Conversation>(
        `/messages/project/${orderId}`,
        {
          token: session?.apiToken ?? null,
        },
      );
      setMessages(conversation.messages);
      setBody("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Message failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <section
      id="order-conversation"
      className="space-y-4 rounded-xl border border-app bg-card p-5"
    >
      <div>
        <h2 className="text-lg font-semibold">Project conversation</h2>
        <p className="mt-1 text-sm text-muted">
          Messages related to this order.
        </p>
      </div>
      <div className="max-h-[26rem] space-y-3 overflow-y-auto">
        {loading ? (
          <p className="text-sm text-muted">Loading conversation…</p>
        ) : null}
        {!loading && messages.length === 0 ? (
          <p className="rounded-lg border border-dashed border-app p-4 text-sm text-muted">
            No messages yet. Start the conversation below.
          </p>
        ) : null}
        {messages.map((message) => (
          <article
            key={message.id}
            className="rounded-lg border border-app p-4"
          >
            <div className="flex flex-wrap justify-between gap-2">
              <p className="text-sm font-medium">{message.senderName}</p>
              <time className="text-xs text-muted">
                {new Date(message.createdAt).toLocaleString()}
              </time>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-body">
              {message.body}
            </p>
          </article>
        ))}
      </div>
      <form onSubmit={send} className="space-y-3 border-t border-app pt-4">
        <Textarea
          rows={3}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Ask a question or request additional work…"
          aria-label="Write a project message"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={sending || !body.trim()}>
            <Send className="h-4 w-4" /> {sending ? "Sending…" : "Send message"}
          </Button>
        </div>
      </form>
    </section>
  );
}
