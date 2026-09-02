// 'user' = registered but hasn't started a project yet. Promoted to 'client'
// the moment they (or an admin, on their behalf) start an order.
export const ROLES = ['admin', 'client', 'user'] as const;
export type Role = (typeof ROLES)[number];

export const SERVICE_TYPES = ['web_app', 'mobile_app', 'meta_ads', 'wordpress', 'other'] as const;
export type ServiceType = (typeof SERVICE_TYPES)[number];

export const PROJECT_CATEGORIES = [
  'saas',
  'travel_booking',
  'ecommerce',
  'marketing_landing',
  'wordpress',
  'mobile',
  'other',
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_STATUSES = [
  'lead',
  'planning',
  'active',
  'delivered',
  'paid',
  'archived',
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const STAGE_STATUSES = ['planned', 'in_progress', 'delivered', 'approved'] as const;
export type StageStatus = (typeof STAGE_STATUSES)[number];

export const BRIEF_STATUSES = ['new', 'contacted', 'converted', 'lost'] as const;
export type BriefStatus = (typeof BRIEF_STATUSES)[number];

export const INVOICE_STATUSES = ['draft', 'sent', 'paid', 'overdue'] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const CURRENCIES = ['USD', 'BDT'] as const;
export type Currency = (typeof CURRENCIES)[number];

// Shared by both Brief.source and Client.source — "how did we find this person".
export const SOURCES = [
  'fiverr',
  'direct',
  'referral',
  'contact_form',
  'self_registered',
  'other',
] as const;
export type Source = (typeof SOURCES)[number];

export const ORDER_STATUSES = [
  'pending',
  'reviewing',
  'accepted',
  'in_progress',
  'delivered',
  'cancelled',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const BUDGET_RANGES = [
  'under_500',
  '500_1500',
  '1500_5000',
  '5000_15000',
  '15000_plus',
  'not_sure',
] as const;
export type BudgetRange = (typeof BUDGET_RANGES)[number];

export const TIMELINES = ['asap', '1_2_weeks', '1_month', '2_3_months', 'flexible'] as const;
export type Timeline = (typeof TIMELINES)[number];
