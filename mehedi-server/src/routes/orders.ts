import { Router, type Router as RouterType } from 'express';
import { orderCreateSchema, orderUpdateSchema } from '../shared/index.js';
import { OrderModel } from '../models/Order.js';
import { UserModel } from '../models/User.js';
import { HttpError, asyncHandler } from '../lib/http.js';
import { requireAuth } from '../middleware/auth.js';
import { generateOrderCode } from '../lib/orderCode.js';
import { toOrder } from '../lib/mappers.js';

const router: RouterType = Router();

router.use(requireAuth);

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

    // Placing an order is what turns a plain registered "user" into a client.
    if (req.user!.role === 'user') {
      await UserModel.findByIdAndUpdate(req.user!.id, { $set: { role: 'client' } });
    }

    res.status(201).json({ order: toOrder(order as never) });
  }),
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const isAdmin = req.user!.role === 'admin';
    const filter: Record<string, unknown> = isAdmin ? {} : { clientId: req.user!.id };

    const statusParam = String(req.query.status ?? '').trim();
    if (isAdmin && statusParam) {
      filter.status = { $in: statusParam.split(',').map((s) => s.trim()) };
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

    const [orders, total] = await Promise.all([
      OrderModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      OrderModel.countDocuments(filter),
    ]);

    if (!isAdmin) {
      res.json({ orders: orders.map((o) => toOrder(o as never)), total, page, pages: Math.ceil(total / limit) });
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
      total,
      page,
      pages: Math.ceil(total / limit),
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
