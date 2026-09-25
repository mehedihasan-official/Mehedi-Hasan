"use client";

import { Avatar } from "@/components/ui/avatar";
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
import { meUpdateSchema, type Client, type MeUpdateInput } from "@/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ProfileForm({
  profile,
  showWelcome,
}: {
  profile: Client;
  showWelcome: boolean;
}) {
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<MeUpdateInput>({
    resolver: zodResolver(meUpdateSchema),
    defaultValues: {
      name: profile.name,
      phone: profile.phone ?? "",
      whatsapp: profile.whatsapp ?? "",
      address: profile.address ?? "",
    },
  });

  async function onSubmitProfile(values: MeUpdateInput) {
    try {
      await apiFetch("/me", {
        method: "PATCH",
        body: JSON.stringify(values),
        token: session?.apiToken ?? null,
      });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  return (
    <div className="space-y-6">
      {showWelcome ? (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
          Welcome! Your dashboard is ready. For your security, please set a new
          password below — the temporary one won&apos;t work for long.
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar name={profile.name} src={profile.avatar} size="xl" />
            <div>
              <CardTitle>{profile.name}</CardTitle>
              <CardDescription>{profile.emails[0]?.address}</CardDescription>
            </div>
          </div>
          <CardDescription className="mt-3">
            Your account details and the best ways for the team to reach you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...register("name")} />
              {errors.name ? (
                <p className="text-xs text-red-400">{errors.name.message}</p>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="+1 …" {...register("phone")} />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input placeholder="+1 …" {...register("whatsapp")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input {...register("address")} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account contact</CardTitle>
          <CardDescription>
            Email is managed by your sign-in provider. Passwords and security
            options live in Settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
          <Detail label="Email" value={profile.emails[0]?.address} />
          <Detail label="Phone" value={profile.phone} />
          <Detail label="WhatsApp" value={profile.whatsapp} />
          <Detail label="Address" value={profile.address} />
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl border border-app bg-elev p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-body">{value || "Not added yet"}</p>
    </div>
  );
}
