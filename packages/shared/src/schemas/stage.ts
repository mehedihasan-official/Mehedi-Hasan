import { z } from 'zod';
import { STAGE_STATUSES } from '../enums.js';

export const stageCreateSchema = z.object({
  projectId: z.string(),
  name: z.string().min(1).max(120),
  order: z.number().int().nonnegative(),
  status: z.enum(STAGE_STATUSES).default('planned'),
  dueDate: z.string().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});
export type StageCreateInput = z.infer<typeof stageCreateSchema>;

export const stageSchema = stageCreateSchema.extend({
  id: z.string(),
  deliveredAt: z.string().nullable(),
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
