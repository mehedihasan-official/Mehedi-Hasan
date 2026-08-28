import { z } from 'zod';

export const messageCreateSchema = z.object({
  projectId: z.string(),
  body: z.string().min(1).max(4000),
  fileIds: z.array(z.string()).default([]),
});
export type MessageCreateInput = z.infer<typeof messageCreateSchema>;

export const messageSchema = messageCreateSchema.extend({
  id: z.string(),
  fromUserId: z.string(),
  toUserId: z.string(),
  readAt: z.string().nullable(),
  createdAt: z.string(),
});
export type Message = z.infer<typeof messageSchema>;
