import { Router, type Router as RouterType } from 'express';
import crypto from 'node:crypto';
import { orderCreateSchema, orderUpdateSchema } from '../shared/index.js';
import { OrderModel } from '../models/Order.js';
import { UserModel } from '../models/User.js';
import { HttpError, asyncHandler } from '../lib/http.js';
import { requireAuth } from '../middleware/auth.js';
import { toOrder } from '../lib/mappers.js';

const router: RouterType = Router();

router.use(requireAuth);

async function generateOrderCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = `ORD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const exists = await OrderModel.exists({ orderCode: code });
    if (!exists) return code;
  }
  throw new HttpError(500, 'Could not generate a unique order code');
}

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const input = orderCreateSchema.parse(req.body);
    const orderCode = await generateOrderCode();
    const order = await OrderModel.create({
      ...input,
      clientId: req.user!.id,
      orderCode,
    });
    res.status(201).json({ order: toOrder(order as never) });
  }),
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = req.user!.role === 'admin' ? {} : { clientId: req.user!.id };
    const orders = await OrderModel.find(filter).sort({ createdAt: -1 }).lean();

    if (req.user!.role !== 'admin') {
      res.json({ orders: orders.map((o) => toOrder(o as never)) });
      return;
    }

    const clientIds = [...new Set(orders.map((o) => String(o.clientId)))];
    const clients = await UserModel.find({ _id: { $in: clientIds } })
      .select('name emails')
      .lean();
    const clientMap = new Map(
      clients.map((c) => [
        String(c._id),
        { name: c.name, email: (c.emails.find((e) => e.primary) ?? c.emails[0])?.address },
      ]),
    );

    res.json({
      orders: orders.map((o) => toOrder(o as never, clientMap.get(String(o.clientId)))),
    });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const order = await OrderModel.findById(req.params.id).lean();
    if (!order) throw new HttpError(404, 'Order not found');
    if (req.user!.role !== 'admin' && String(order.clientId) !== req.user!.id) {
      throw new HttpError(404, 'Order not found');
    }

    let client = null;
    if (req.user!.role === 'admin') {
      const c = await UserModel.findById(order.clientId).select('name emails').lean();
      if (c) client = { name: c.name, email: (c.emails.find((e) => e.primary) ?? c.emails[0])?.address };
    }

    res.json({ order: toOrder(order as never, client) });
  }),
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    if (req.user!.role !== 'admin') throw new HttpError(403, 'Forbidden');
    const input = orderUpdateSchema.parse(req.body);
    const updated = await OrderModel.findByIdAndUpdate(req.params.id, { $set: input }, { new: true });
    if (!updated) throw new HttpError(404, 'Order not found');
    res.json({ order: toOrder(updated as never) });
  }),
);

export default router;
