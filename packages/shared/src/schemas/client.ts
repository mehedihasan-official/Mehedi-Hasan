import { z } from 'zod';
import { LEAD_SOURCES } from '../enums.js';
import { emailEntrySchema } from './user.js';

export const clientCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  emails: z.array(emailEntrySchema).min(1, 'At least one email is required'),
  phone: z.string().max(30).optional().nullable(),
  whatsapp: z.string().max(30).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  timezone: z.string().max(60).optional().nullable(),
  country: z.string().max(60).optional().nullable(),
  source: z.enum(LEAD_SOURCES).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  avatar: z.string().url().optional().nullable(),
});
export type ClientCreateInput = z.infer<typeof clientCreateSchema>;

export const clientUpdateSchema = clientCreateSchema.partial().extend({
  active: z.boolean().optional(),
});
export type ClientUpdateInput = z.infer<typeof clientUpdateSchema>;

export const clientSchema = clientCreateSchema.extend({
  id: z.string(),
  active: z.boolean(),
  activeProjectCount: z.number().int().nonnegative().default(0),
  lifetimeValue: z.number().nonnegative().default(0),
  lastActivityAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Client = z.infer<typeof clientSchema>;
