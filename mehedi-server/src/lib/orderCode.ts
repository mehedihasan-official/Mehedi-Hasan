import crypto from 'node:crypto';
import { OrderModel } from '../models/Order.js';
import { HttpError } from './http.js';

export async function generateOrderCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = `ORD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const exists = await OrderModel.exists({ orderCode: code });
    if (!exists) return code;
  }
  throw new HttpError(500, 'Could not generate a unique order code');
}
