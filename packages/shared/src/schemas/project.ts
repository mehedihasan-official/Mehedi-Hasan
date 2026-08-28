import { z } from 'zod';
import { CURRENCIES, PROJECT_CATEGORIES, PROJECT_STATUSES, SERVICE_TYPES } from '../enums.js';

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

export const projectUpdateSchema = projectCreateSchema.partial().extend({
  publishedToPortfolio: z.boolean().optional(),
  caseStudy: z.string().optional().nullable(),
});
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;

export const projectSchema = projectCreateSchema.extend({
  id: z.string(),
  slug: z.string(),
  publishedToPortfolio: z.boolean().default(false),
  caseStudy: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Project = z.infer<typeof projectSchema>;
