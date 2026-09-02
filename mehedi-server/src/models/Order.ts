import { Schema, model, type InferSchemaType } from 'mongoose';
import { BUDGET_RANGES, ORDER_STATUSES, SERVICE_TYPES, TIMELINES } from '../shared/index.js';

const orderSchema = new Schema(
  {
    orderCode: { type: String, required: true, unique: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    serviceType: { type: String, enum: SERVICE_TYPES, required: true },
    budgetRange: { type: String, enum: BUDGET_RANGES, required: true },
    timeline: { type: String, enum: TIMELINES, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ORDER_STATUSES, default: 'pending', index: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    projectUrl: { type: String, default: null },
    notes: { type: String, default: null },
  },
  { timestamps: true },
);

export type OrderDoc = InferSchemaType<typeof orderSchema> & { _id: unknown };
export const OrderModel = model('Order', orderSchema);
