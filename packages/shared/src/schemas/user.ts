import { z } from 'zod';
import { ROLES } from '../enums.js';

export const emailEntrySchema = z.object({
  address: z.string().email(),
  label: z.string().max(40).optional(),
  primary: z.boolean().default(false),
});
export type EmailEntry = z.infer<typeof emailEntrySchema>;

export const userSchema = z.object({
  id: z.string(),
  role: z.enum(ROLES),
  name: z.string().min(1).max(120),
  emails: z.array(emailEntrySchema).min(1),
  phone: z.string().max(30).optional().nullable(),
  whatsapp: z.string().max(30).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  timezone: z.string().max(60).optional().nullable(),
  country: z.string().max(60).optional().nullable(),
  avatar: z.string().url().optional().nullable(),
  active: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type User = z.infer<typeof userSchema>;

export const publicUserSchema = userSchema.pick({
  id: true,
  role: true,
  name: true,
  emails: true,
  avatar: true,
  active: true,
});
export type PublicUser = z.infer<typeof publicUserSchema>;
