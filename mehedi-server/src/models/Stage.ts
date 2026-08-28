import { Schema, Types, model, type InferSchemaType } from 'mongoose';

const stageSchema = new Schema(
  {
    projectId: { type: Types.ObjectId, ref: 'Project', required: true, index: true },
    name: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 0 },
    status: { type: String, default: 'planned', index: true },
    dueDate: Date,
    deliveredAt: Date,
    notes: String,
  },
  { timestamps: true },
);

export type StageDoc = InferSchemaType<typeof stageSchema> & { _id: unknown };
export const StageModel = model('Stage', stageSchema);
