import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Client } from "@/shared";
import {
  CalendarDays,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
} from "lucide-react";
import Link from "next/link";

export function ProfileOverview({
  profile,
  showWelcome,
}: {
  profile: Client;
  showWelcome: boolean;
}) {
  return (
    <div className="space-y-6">
      {showWelcome ? (
        <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200 sm:flex-row sm:items-center">
          <span>
            Welcome. Update your sign-in password in Settings to secure your
            account.
          </span>
          <Link
            href="/dashboard/settings"
            className="min-h-11 font-medium underline underline-offset-4"
          >
            Open Settings
          </Link>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <Avatar name={profile.name} src={profile.avatar} size="xl" />
              <div className="min-w-0">
                <CardTitle>{profile.name}</CardTitle>
                <CardDescription className="mt-1 break-all">
                  {profile.emails[0]?.address}
                </CardDescription>
              </div>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link
                href="/dashboard/settings"
                title="Edit profile settings"
                aria-label="Edit profile settings"
              >
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <CardDescription className="mt-3">
            Account created {formatDate(profile.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Detail
            icon={Mail}
            label="Email"
            value={profile.emails[0]?.address}
          />
          <Detail icon={Phone} label="Phone" value={profile.phone} />
          <Detail
            icon={MessageCircle}
            label="WhatsApp"
            value={profile.whatsapp}
          />
          <Detail icon={MapPin} label="Address" value={profile.address} />
          <Detail
            icon={CalendarDays}
            label="Member since"
            value={formatDate(profile.createdAt)}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-lg border border-app p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="mt-1 break-words text-sm text-body">
          {value || "Not added yet"}
        </p>
      </div>
    </div>
  );
}
