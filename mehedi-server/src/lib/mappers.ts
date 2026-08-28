import type { UserDoc } from '../models/User.js';
import type { Client, SessionUser } from '../shared/index.js';

type WithId<T> = T & { _id: unknown; createdAt?: Date; updatedAt?: Date };

function primaryEmail(user: WithId<UserDoc>): string {
  const primary = user.emails.find((e) => e.primary) ?? user.emails[0];
  return primary!.address;
}

export function toSessionUser(user: WithId<UserDoc>): SessionUser {
  return {
    id: String(user._id),
    role: user.role as SessionUser['role'],
    name: user.name,
    email: primaryEmail(user),
    avatar: user.avatar ?? null,
  };
}

export function toClient(user: WithId<UserDoc>, extras?: {
  activeProjectCount?: number;
  lifetimeValue?: number;
}): Client {
  return {
    id: String(user._id),
    name: user.name,
    emails: user.emails.map((e) => ({
      address: e.address,
      label: e.label ?? undefined,
      primary: !!e.primary,
    })),
    phone: user.phone ?? null,
    whatsapp: user.whatsapp ?? null,
    address: user.address ?? null,
    timezone: user.timezone ?? null,
    country: user.country ?? null,
    source: (user.source as Client['source']) ?? null,
    notes: user.notes ?? null,
    avatar: user.avatar ?? null,
    active: !!user.active,
    activeProjectCount: extras?.activeProjectCount ?? 0,
    lifetimeValue: extras?.lifetimeValue ?? 0,
    lastActivityAt: user.lastActivityAt ? user.lastActivityAt.toISOString() : null,
    createdAt: user.createdAt ? user.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: user.updatedAt ? user.updatedAt.toISOString() : new Date().toISOString(),
  };
}
