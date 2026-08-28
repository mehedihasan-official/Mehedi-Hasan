import { Schema, Types, model, type InferSchemaType } from 'mongoose';

const leadSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: String,
    whatsapp: String,
    serviceType: { type: String, required: true },
    budgetRange: { type: String, required: true },
    timeline: { type: String, required: true },
    message: String,
    source: { type: String, default: 'contact_form' },
    status: { type: String, default: 'new', index: true },
    convertedToClientId: { type: Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export type LeadDoc = InferSchemaType<typeof leadSchema> & { _id: unknown };
export const LeadModel = model('Lead', leadSchema);
