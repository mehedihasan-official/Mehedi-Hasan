import { z } from 'zod';
import { CURRENCIES, INVOICE_STATUSES } from '../enums.js';

export const invoiceItemSchema = z.object({
  description: z.string().min(1).max(400),
  quantity: z.number().positive().default(1),
  rate: z.number().nonnegative(),
});
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;

export const invoiceCreateSchema = z.object({
  projectId: z.string(),
  clientId: z.string(),
  items: z.array(invoiceItemSchema).min(1),
  currency: z.enum(CURRENCIES).default('USD'),
  dueDate: z.string().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});
export type InvoiceCreateInput = z.infer<typeof invoiceCreateSchema>;

export const invoiceSchema = invoiceCreateSchema.extend({
  id: z.string(),
  number: z.string(),
  amount: z.number().nonnegative(),
  status: z.enum(INVOICE_STATUSES),
  sentAt: z.string().nullable(),
  paidAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Invoice = z.infer<typeof invoiceSchema>;
