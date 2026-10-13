import { Schema, model, type InferSchemaType } from 'mongoose';

const leadSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    name: { type: String, trim: true },
    source: { type: String, enum: ['login', 'manual'], required: true },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export type LeadDoc = InferSchemaType<typeof leadSchema> & { _id: unknown };
export const LeadModel = model('Lead', leadSchema);
