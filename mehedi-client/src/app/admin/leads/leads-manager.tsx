'use client';

import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import type { Lead } from '@/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, Label } from '@/components/ui/input';
import { useSession } from '@/hooks/use-session';
import { apiFetch } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export function LeadsManager({ initial }: { initial: Lead[] }) {
  const [leads, setLeads] = useState(initial);
  const [email, setEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { data: session } = useSession();

  async function addLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsAdding(true);
    try {
      const { lead } = await apiFetch<{ lead: Lead }>('/leads', {
        method: 'POST',
        body: JSON.stringify({ email }),
        token: session?.apiToken ?? null,
      });
      setLeads((current) => [lead, ...current]);
      setEmail('');
      toast.success('Lead added');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add lead');
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add a lead</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addLead} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="lead-email">Email address</Label>
              <Input
                id="lead-email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <Button type="submit" disabled={isAdding || !email.trim()}>
              {isAdding ? 'Adding…' : 'Add lead'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email leads ({leads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <p className="py-5 text-sm text-muted">
              No leads yet. Account emails will appear here after a successful login.
            </p>
          ) : (
            <div className="divide-y divide-app">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-body">{lead.email}</p>
                    {lead.name ? <p className="mt-1 text-xs text-muted">{lead.name}</p> : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge tone={lead.source === 'login' ? 'brand' : 'neutral'}>
                      {lead.source === 'login' ? 'Account login' : 'Manual'}
                    </Badge>
                    <span className="text-xs text-subtle">
                      {lead.lastLoginAt
                        ? `Last login ${formatDate(lead.lastLoginAt)}`
                        : `Added ${formatDate(lead.createdAt)}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
