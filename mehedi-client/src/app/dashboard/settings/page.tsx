import { EmptyState } from "@/components/ui/empty-state";
import { apiFetchSafe } from "@/lib/api";
import { getSession } from "@/lib/session";
import type { Client } from "@/shared";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getSession();
  const { data, error } = await apiFetchSafe<{ profile: Client | null }>(
    "/me",
    { profile: null },
    { server: true, token: session?.apiToken },
  );
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted">
          Keep your contact details current and manage account security.
        </p>
      </div>
      {error || !data.profile ? (
        <EmptyState
          tone="warning"
          title="Can't load your settings"
          description={error ?? undefined}
        />
      ) : (
        <SettingsForm profile={data.profile} />
      )}
    </div>
  );
}
