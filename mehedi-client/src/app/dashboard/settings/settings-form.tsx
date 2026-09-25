"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { useSession } from "@/hooks/use-session";
import { apiFetch } from "@/lib/api";
import { auth } from "@/lib/firebase";
import type { Client, MeUpdateInput } from "@/shared";
import { meUpdateSchema } from "@/shared";
import {
  EmailAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  reauthenticateWithCredential,
  updatePassword,
  type User,
} from "firebase/auth";
import { useState } from "react";
import { toast } from "sonner";

export function SettingsForm({ profile }: { profile: Client }) {
  const { data: session } = useSession();
  const [contact, setContact] = useState<MeUpdateInput>({
    name: profile.name,
    phone: profile.phone ?? "",
    whatsapp: profile.whatsapp ?? "",
    address: profile.address ?? "",
    timezone: "",
    country: "",
  });
  const [savingContact, setSavingContact] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const hasEmailProvider = Boolean(
    auth.currentUser?.providerData.some(
      (provider) => provider.providerId === "password",
    ),
  );

  async function saveContact(event: React.FormEvent) {
    event.preventDefault();
    const parsed = meUpdateSchema.safeParse(contact);
    if (!parsed.success)
      return toast.error(
        parsed.error.issues[0]?.message ?? "Check your details",
      );
    setSavingContact(true);
    try {
      await apiFetch("/me", {
        method: "PATCH",
        body: JSON.stringify(parsed.data),
        token: session?.apiToken ?? null,
      });
      toast.success("Contact details updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSavingContact(false);
    }
  }

  async function savePassword(event: React.FormEvent) {
    event.preventDefault();
    if (newPassword.length < 6) return toast.error("Use at least 6 characters");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords don't match");
    setSavingPassword(true);
    try {
      const user = auth.currentUser ?? (await waitForFirebaseUser());
      if (!user) throw new Error("Not signed in");
      if (hasEmailProvider) {
        if (!currentPassword) return toast.error("Enter your current password");
        await reauthenticateWithCredential(
          user,
          EmailAuthProvider.credential(
            user.email ?? session?.user.email ?? "",
            currentPassword,
          ),
        );
        await updatePassword(user, newPassword);
      } else {
        await linkWithCredential(
          user,
          EmailAuthProvider.credential(
            user.email ?? session?.user.email ?? "",
            newPassword,
          ),
        );
      }
      toast.success(
        hasEmailProvider
          ? "Password changed"
          : "Password added. You can now sign in with email and password.",
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const code = (err as { code?: string } | undefined)?.code;
      toast.error(
        code === "auth/invalid-credential" || code === "auth/wrong-password"
          ? "Current password is incorrect"
          : err instanceof Error
            ? err.message
            : "Password update failed",
      );
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact details</CardTitle>
          <CardDescription>
            These details are used when the team needs to reach you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveContact} className="space-y-4">
            {(["name", "phone", "whatsapp", "address"] as const).map(
              (field) => (
                <div key={field} className="space-y-2">
                  <Label>{field[0].toUpperCase() + field.slice(1)}</Label>
                  <Input
                    value={contact[field] ?? ""}
                    onChange={(event) =>
                      setContact({ ...contact, [field]: event.target.value })
                    }
                  />
                </div>
              ),
            )}
            <div className="flex justify-end">
              <Button type="submit" disabled={savingContact}>
                {savingContact ? "Saving…" : "Save contact details"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            {hasEmailProvider ? "Change password" : "Set a password"}
          </CardTitle>
          <CardDescription>
            {hasEmailProvider
              ? "Your current password is required before a new one can be saved."
              : "Add email and password sign-in to your Google account."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={savePassword} className="space-y-4">
            {hasEmailProvider ? (
              <div className="space-y-2">
                <Label>Current password</Label>
                <Input
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>New password</Label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Confirm password</Label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={savingPassword || !newPassword}>
                {savingPassword
                  ? "Saving…"
                  : hasEmailProvider
                    ? "Change password"
                    : "Set password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function waitForFirebaseUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}
