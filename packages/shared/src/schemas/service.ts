import { z } from 'zod';
import { SERVICE_TYPES } from '../enums.js';

export const serviceTierSchema = z.object({
  name: z.string().min(1).max(60),
  price: z.number().nonnegative(),
  currency: z.string().default('USD'),
  features: z.array(z.string()).default([]),
  deliveryDays: z.number().int().positive().optional().nullable(),
});
export type ServiceTier = z.infer<typeof serviceTierSchema>;

export const serviceSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(120),
  slug: z.string(),
  serviceType: z.enum(SERVICE_TYPES),
  description: z.string().max(2000),
  tiers: z.array(serviceTierSchema).default([]),
  icon: z.string().max(60).optional().nullable(),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Service = z.infer<typeof serviceSchema>;
