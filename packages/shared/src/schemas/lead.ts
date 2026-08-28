import { z } from 'zod';
import { BUDGET_RANGES, LEAD_SOURCES, LEAD_STATUSES, SERVICE_TYPES, TIMELINES } from '../enums.js';

export const leadCreateSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().max(30).optional().nullable(),
  whatsapp: z.string().max(30).optional().nullable(),
  serviceType: z.enum(SERVICE_TYPES),
  budgetRange: z.enum(BUDGET_RANGES),
  timeline: z.enum(TIMELINES),
  message: z.string().max(4000).optional().nullable(),
  source: z.enum(LEAD_SOURCES).default('contact_form'),
});
export type LeadCreateInput = z.infer<typeof leadCreateSchema>;

export const leadSchema = leadCreateSchema.extend({
  id: z.string(),
  status: z.enum(LEAD_STATUSES),
  convertedToClientId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Lead = z.infer<typeof leadSchema>;
