'use client';

import { useState, type FormEvent } from 'react';
import { Heart, Trash2 } from 'lucide-react';
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
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [editName, setEditName] = useState('');
  const [editWhatsapp, setEditWhatsapp] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [importanceId, setImportanceId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { data: session } = useSession();
  const query = search.trim().toLocaleLowerCase();
  const numberQuery = query.replace(/\D/g, '');
  const filteredLeads = [
    ...(query
      ? leads.filter((lead) =>
        lead.email.toLocaleLowerCase().includes(query) ||
        Boolean(lead.name?.toLocaleLowerCase().includes(query)) ||
        Boolean(lead.whatsapp?.toLocaleLowerCase().includes(query)) ||
        Boolean(
          numberQuery &&
            lead.whatsapp?.replace(/\D/g, '').includes(numberQuery),
        ),
        )
      : leads),
  ].sort((left, right) => Number(right.important) - Number(left.important));

  async function addLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsAdding(true);
    try {
      const { lead } = await apiFetch<{ lead: Lead }>('/leads', {
        method: 'POST',
        body: JSON.stringify({ email, name, whatsapp }),
        token: session?.apiToken ?? null,
      });
      setLeads((current) => [lead, ...current]);
      setEmail('');
      setName('');
      setWhatsapp('');
      toast.success('Lead added');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add lead');
    } finally {
      setIsAdding(false);
    }
  }

  function startEditing(lead: Lead) {
    setEditingId(lead.id);
    setEditEmail(lead.email);
    setEditName(lead.name ?? '');
    setEditWhatsapp(lead.whatsapp ?? '');
  }

  function cancelEditing() {
    setEditingId(null);
    setEditEmail('');
    setEditName('');
    setEditWhatsapp('');
  }

  async function saveLead(event: FormEvent<HTMLFormElement>, lead: Lead) {
    event.preventDefault();
    setIsSaving(true);
    try {
      const { lead: updated } = await apiFetch<{ lead: Lead }>(`/leads/${lead.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ email: editEmail, name: editName, whatsapp: editWhatsapp }),
        token: session?.apiToken ?? null,
      });
      setLeads((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      cancelEditing();
      toast.success('Lead updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update lead');
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteLead(lead: Lead) {
    if (!confirm(`Delete the lead for ${lead.email}? This can't be undone.`)) return;
    setDeletingId(lead.id);
    try {
      await apiFetch(`/leads/${lead.id}`, {
        method: 'DELETE',
        token: session?.apiToken ?? null,
      });
      setLeads((current) => current.filter((item) => item.id !== lead.id));
      toast.success('Lead deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete lead');
    } finally {
      setDeletingId(null);
    }
  }

  async function toggleImportant(lead: Lead) {
    setImportanceId(lead.id);
    try {
      const { lead: updated } = await apiFetch<{ lead: Lead }>(`/leads/${lead.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ important: !lead.important }),
        token: session?.apiToken ?? null,
      });
      setLeads((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      toast.success(updated.important ? 'Lead marked important' : 'Lead unmarked');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update lead importance');
    } finally {
      setImportanceId(null);
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
            <div className="grid flex-1 gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="lead-name">Name (optional)</Label>
                <Input
                  id="lead-name"
                  autoComplete="name"
                  maxLength={120}
                  placeholder="Client name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
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
              <div className="space-y-2">
                <Label htmlFor="lead-whatsapp">WhatsApp number (optional)</Label>
                <Input
                  id="lead-whatsapp"
                  type="tel"
                  autoComplete="tel"
                  maxLength={30}
                  placeholder="+1 234 567 8900"
                  value={whatsapp}
                  onChange={(event) => setWhatsapp(event.target.value)}
                />
              </div>
            </div>
            <Button type="submit" disabled={isAdding}>
              {isAdding ? 'Adding…' : 'Add lead'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Leads ({filteredLeads.length}
            {query ? ` of ${leads.length}` : ''})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <p className="py-5 text-sm text-muted">
              No leads yet. Account emails will appear here after a successful login.
            </p>
          ) : (
            <div className="space-y-4">
              <Input
                type="search"
                aria-label="Search leads by email, name, or WhatsApp number"
                placeholder="Search by email, name, or WhatsApp number…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {filteredLeads.length === 0 ? (
                <p className="py-5 text-sm text-muted">
                  No leads match “{search.trim()}”.
                </p>
              ) : (
                <div className="divide-y divide-app">
                  {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="py-4 first:pt-0 last:pb-0"
                >
                  {editingId === lead.id ? (
                    <form
                      onSubmit={(event) => saveLead(event, lead)}
                      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"
                    >
                      <div className="space-y-2">
                        <Label htmlFor={`lead-name-${lead.id}`}>Name (optional)</Label>
                        <Input
                          id={`lead-name-${lead.id}`}
                          autoComplete="name"
                          maxLength={120}
                          value={editName}
                          onChange={(event) => setEditName(event.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`lead-email-${lead.id}`}>Email address</Label>
                        <Input
                          id={`lead-email-${lead.id}`}
                          type="email"
                          autoComplete="email"
                          required
                          maxLength={254}
                          value={editEmail}
                          onChange={(event) => setEditEmail(event.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`lead-whatsapp-${lead.id}`}>WhatsApp number</Label>
                        <Input
                          id={`lead-whatsapp-${lead.id}`}
                          type="tel"
                          autoComplete="tel"
                          maxLength={30}
                          placeholder="+1 234 567 8900"
                          value={editWhatsapp}
                          onChange={(event) => setEditWhatsapp(event.target.value)}
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <Button type="submit" size="sm" disabled={isSaving}>
                          {isSaving ? 'Saving…' : 'Save'}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={cancelEditing}
                          disabled={isSaving}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-body">{lead.email}</p>
                        {lead.name ? <p className="mt-1 text-xs text-muted">{lead.name}</p> : null}
                        <p className="mt-1 text-xs text-muted">
                          WhatsApp: {lead.whatsapp || 'Not added'}
                        </p>
                        <p className="mt-1 text-xs text-subtle">
                          {lead.lastLoginAt
                            ? `Last login ${formatDate(lead.lastLoginAt)}`
                            : `Added ${formatDate(lead.createdAt)}`}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          aria-label={lead.important ? 'Remove important mark' : 'Mark lead important'}
                          aria-pressed={lead.important}
                          title={lead.important ? 'Important lead' : 'Mark as important'}
                          onClick={() => toggleImportant(lead)}
                          disabled={Boolean(importanceId) || deletingId === lead.id}
                          className={lead.important ? 'text-rose-500 hover:text-rose-400' : 'text-muted'}
                        >
                          <Heart
                            className="h-4 w-4"
                            fill={lead.important ? 'currentColor' : 'none'}
                          />
                        </Button>
                        <Badge tone={lead.source === 'login' ? 'brand' : 'neutral'}>
                          {lead.source === 'login' ? 'Account login' : 'Manual'}
                        </Badge>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(lead)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="danger"
                          onClick={() => deleteLead(lead)}
                          disabled={deletingId === lead.id}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {deletingId === lead.id ? 'Deleting…' : ''}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
