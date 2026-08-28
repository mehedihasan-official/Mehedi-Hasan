import { Schema, Types, model, type InferSchemaType } from 'mongoose';

const messageSchema = new Schema(
  {
    projectId: { type: Types.ObjectId, ref: 'Project', required: true, index: true },
    fromUserId: { type: Types.ObjectId, ref: 'User', required: true },
    toUserId: { type: Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true },
    fileIds: [{ type: Types.ObjectId, ref: 'FileAsset' }],
    readAt: Date,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export type MessageDoc = InferSchemaType<typeof messageSchema> & { _id: unknown };
export const MessageModel = model('Message', messageSchema);
