import { Schema, Types, model, type InferSchemaType } from 'mongoose';

const invoiceItemSchema = new Schema(
  {
    description: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    rate: { type: Number, required: true },
  },
  { _id: false },
);

const invoiceSchema = new Schema(
  {
    number: { type: String, required: true, unique: true, index: true },
    projectId: { type: Types.ObjectId, ref: 'Project', required: true, index: true },
    clientId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [invoiceItemSchema], required: true, default: [] },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: { type: String, default: 'draft', index: true },
    dueDate: Date,
    sentAt: Date,
    paidAt: Date,
    notes: String,
  },
  { timestamps: true },
);

export type InvoiceDoc = InferSchemaType<typeof invoiceSchema> & { _id: unknown };
export const InvoiceModel = model('Invoice', invoiceSchema);
