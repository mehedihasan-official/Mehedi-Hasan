import { z } from 'zod';
import { ROLES } from '../enums.js';

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginInputSchema>;

export const inviteAcceptSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8, 'Use at least 8 characters').max(200),
  name: z.string().min(1).max(120).optional(),
});
export type InviteAcceptInput = z.infer<typeof inviteAcceptSchema>;

export const sessionUserSchema = z.object({
  id: z.string(),
  role: z.enum(ROLES),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().url().nullable().optional(),
});
export type SessionUser = z.infer<typeof sessionUserSchema>;

export const loginResponseSchema = z.object({
  token: z.string(),
  user: sessionUserSchema,
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;
