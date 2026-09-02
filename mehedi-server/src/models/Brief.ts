import { Schema, model, type InferSchemaType } from 'mongoose';

const briefSchema = new Schema(
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
    // Set when the submitter was logged in — lets the brief show up in their
    // own dashboard and lets "start order" promote them to a client.
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    // Set once an admin turns this brief into an order.
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', default: null },
  },
  { timestamps: true },
);

export type BriefDoc = InferSchemaType<typeof briefSchema> & { _id: unknown };
export const BriefModel = model('Brief', briefSchema);
