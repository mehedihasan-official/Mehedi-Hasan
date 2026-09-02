import { z } from 'zod';
import {
  BUDGET_RANGES,
  CURRENCIES,
  INVOICE_STATUSES,
  LEAD_SOURCES,
  LEAD_STATUSES,
  ORDER_STATUSES,
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
  ROLES,
  SERVICE_TYPES,
  STAGE_STATUSES,
  TIMELINES,
} from './enums.js';

// ---------- User ----------
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

// ---------- Client ----------
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

// ---------- Lead ----------
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

// ---------- Project ----------
export const projectLinksSchema = z.object({
  live: z.string().url().optional().nullable(),
  repo: z.string().url().optional().nullable(),
  figma: z.string().url().optional().nullable(),
  staging: z.string().url().optional().nullable(),
});
export type ProjectLinks = z.infer<typeof projectLinksSchema>;

export const projectCreateSchema = z.object({
  clientId: z.string(),
  title: z.string().min(1).max(200),
  serviceType: z.enum(SERVICE_TYPES),
  category: z.enum(PROJECT_CATEGORIES).default('other'),
  description: z.string().max(4000).optional().nullable(),
  stack: z.array(z.string().max(60)).default([]),
  budget: z.number().nonnegative().optional().nullable(),
  currency: z.enum(CURRENCIES).default('USD'),
  startDate: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  links: projectLinksSchema.optional(),
  coverImage: z.string().url().optional().nullable(),
  status: z.enum(PROJECT_STATUSES).default('planning'),
  internalNotes: z.string().max(4000).optional().nullable(),
  cost: z.number().nonnegative().optional().nullable(),
});
export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;

export const projectSchema = projectCreateSchema.extend({
  id: z.string(),
  slug: z.string(),
  publishedToPortfolio: z.boolean().default(false),
  caseStudy: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Project = z.infer<typeof projectSchema>;

// ---------- Stage ----------
export const stageSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string().min(1).max(120),
  order: z.number().int().nonnegative(),
  status: z.enum(STAGE_STATUSES).default('planned'),
  dueDate: z.string().optional().nullable(),
  deliveredAt: z.string().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Stage = z.infer<typeof stageSchema>;

export const STAGE_TEMPLATES: Record<string, string[]> = {
  web_app: [
    'Setup + Auth',
    'Header + Home + Footer',
    'Core Features',
    'Detail Pages',
    'Admin / Dashboard',
    'QA + Deployment',
  ],
  mobile_app: [
    'Setup + Auth',
    'Navigation + Home',
    'Core Screens',
    'Detail Screens',
    'Push + Notifications',
    'Store Submission',
  ],
  meta_ads: ['Research + Audience', 'Creative Production', 'Launch', 'Optimization', 'Report'],
  wordpress: ['Setup + Theme', 'Pages + Content', 'Plugins + Forms', 'QA + Launch'],
  other: ['Discovery', 'Delivery', 'Review'],
};

// ---------- Invoice ----------
export const invoiceItemSchema = z.object({
  description: z.string().min(1).max(400),
  quantity: z.number().positive().default(1),
  rate: z.number().nonnegative(),
});
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;

export const invoiceSchema = z.object({
  id: z.string(),
  number: z.string(),
  projectId: z.string(),
  clientId: z.string(),
  items: z.array(invoiceItemSchema).min(1),
  amount: z.number().nonnegative(),
  currency: z.enum(CURRENCIES).default('USD'),
  status: z.enum(INVOICE_STATUSES),
  dueDate: z.string().optional().nullable(),
  sentAt: z.string().nullable(),
  paidAt: z.string().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Invoice = z.infer<typeof invoiceSchema>;

// ---------- Message ----------
export const messageCreateSchema = z.object({
  projectId: z.string(),
  body: z.string().min(1).max(4000),
  fileIds: z.array(z.string()).default([]),
});
export type MessageCreateInput = z.infer<typeof messageCreateSchema>;

// ---------- Order ----------
export const orderCreateSchema = z.object({
  serviceType: z.enum(SERVICE_TYPES),
  budgetRange: z.enum(BUDGET_RANGES),
  timeline: z.enum(TIMELINES),
  description: z.string().min(1, 'Tell me a bit about what you need').max(4000),
});
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;

export const orderUpdateSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});
export type OrderUpdateInput = z.infer<typeof orderUpdateSchema>;

export const orderSchema = orderCreateSchema.extend({
  id: z.string(),
  orderCode: z.string(),
  clientId: z.string(),
  clientName: z.string().optional(),
  clientEmail: z.string().optional(),
  status: z.enum(ORDER_STATUSES),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Order = z.infer<typeof orderSchema>;

// ---------- Auth ----------
export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginInputSchema>;

export const firebaseAuthInputSchema = z.object({
  idToken: z.string().min(10),
  name: z.string().min(1).max(120).optional(),
});
export type FirebaseAuthInput = z.infer<typeof firebaseAuthInputSchema>;

export const sessionUserSchema = z.object({
  id: z.string(),
  role: z.enum(ROLES),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().url().nullable().optional(),
});
export type SessionUser = z.infer<typeof sessionUserSchema>;
