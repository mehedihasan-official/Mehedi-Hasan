import { z } from 'zod';

export const testimonialSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  projectId: z.string().nullable(),
  quote: z.string().min(1).max(2000),
  rating: z.number().int().min(1).max(5).default(5),
  avatarUrl: z.string().url().optional().nullable(),
  approved: z.boolean().default(false),
  featured: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Testimonial = z.infer<typeof testimonialSchema>;
