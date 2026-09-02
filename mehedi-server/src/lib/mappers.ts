import type { UserDoc } from '../models/User.js';
import type { OrderDoc } from '../models/Order.js';
import type { Client, Order, SessionUser } from '../shared/index.js';

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

export function toOrder(
  order: WithId<OrderDoc>,
  client?: { name?: string; email?: string } | null,
): Order {
  return {
    id: String(order._id),
    orderCode: order.orderCode,
    clientId: String(order.clientId),
    clientName: client?.name,
    clientEmail: client?.email,
    serviceType: order.serviceType as Order['serviceType'],
    budgetRange: order.budgetRange as Order['budgetRange'],
    timeline: order.timeline as Order['timeline'],
    description: order.description,
    status: order.status as Order['status'],
    createdAt: order.createdAt ? order.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: order.updatedAt ? order.updatedAt.toISOString() : new Date().toISOString(),
  };
}
