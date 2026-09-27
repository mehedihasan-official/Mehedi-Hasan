import { Router, type Router as RouterType } from "express";
import crypto from "node:crypto";
import { HttpError, asyncHandler } from "../lib/http.js";
import { toOrder } from "../lib/mappers.js";
import { generateOrderCode } from "../lib/orderCode.js";
import { requireAuth } from "../middleware/auth.js";
import { InvoiceModel } from "../models/Invoice.js";
import { OrderModel } from "../models/Order.js";
import { UserModel } from "../models/User.js";
import { orderCreateSchema, orderUpdateSchema } from "../shared/index.js";

const router: RouterType = Router();

router.use(requireAuth);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = orderCreateSchema.parse(req.body);
    const orderCode = await generateOrderCode();
    const order = await OrderModel.create({
      ...input,
      clientId: req.user!.id,
      orderCode,
    });

    // Placing an order is what turns a plain registered "user" into a client.
    if (req.user!.role === "user") {
      await UserModel.findByIdAndUpdate(req.user!.id, {
        $set: { role: "client" },
      });
    }

    res.status(201).json({ order: toOrder(order as never) });
  }),
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const isAdmin = req.user!.role === "admin";
    const filter: Record<string, unknown> = isAdmin
      ? {}
      : { clientId: req.user!.id };

    const statusParam = String(req.query.status ?? "").trim();
    if (isAdmin && statusParam) {
      filter.status = { $in: statusParam.split(",").map((s) => s.trim()) };
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
      res.json({
        orders: orders.map((o) => toOrder(o as never)),
        total,
        page,
        pages: Math.ceil(total / limit),
      });
      return;
    }

    const clientIds = [...new Set(orders.map((o) => String(o.clientId)))];
    const clients = await UserModel.find({ _id: { $in: clientIds } })
      .select("name emails")
      .lean();
    const clientMap = new Map(
      clients.map((c) => [
        String(c._id),
        {
          name: c.name,
          email: (c.emails.find((e) => e.primary) ?? c.emails[0])?.address,
        },
      ]),
    );

    res.json({
      orders: orders.map((o) =>
        toOrder(o as never, clientMap.get(String(o.clientId))),
      ),
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const order = await OrderModel.findById(req.params.id).lean();
    if (!order) throw new HttpError(404, "Order not found");
    if (req.user!.role !== "admin" && String(order.clientId) !== req.user!.id) {
      throw new HttpError(404, "Order not found");
    }

    const c = await UserModel.findById(order.clientId)
      .select("name emails whatsapp")
      .lean();
    const client = c
      ? {
          name: c.name,
          email: (c.emails.find((e) => e.primary) ?? c.emails[0])?.address,
          whatsapp: c.whatsapp,
        }
      : null;

    res.json({ order: toOrder(order as never, client) });
  }),
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    if (req.user!.role !== "admin") throw new HttpError(403, "Forbidden");
    const input = orderUpdateSchema.parse(req.body);
    const updated = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { $set: input },
      { new: true },
    );
    if (!updated) throw new HttpError(404, "Order not found");
    if (updated.status === "accepted" || updated.status === "in_progress") {
      const amount = updated.budgetAmount ?? 0;
      const service = String(updated.serviceType).replaceAll("_", " ");
      await InvoiceModel.findOneAndUpdate(
        { orderId: updated._id },
        {
          $setOnInsert: {
            number: `INV-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
            projectId: updated._id,
            orderId: updated._id,
            clientId: updated.clientId,
            items: [
              { description: `${service} project`, quantity: 1, rate: amount },
            ],
            amount,
            currency: "USD",
            status: "draft",
            notes: amount
              ? null
              : "Set the agreed project price before sending this invoice.",
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      if (input.budgetAmount !== undefined) {
        await InvoiceModel.updateOne(
          { orderId: updated._id, status: "draft" },
          { $set: { amount, "items.0.rate": amount } },
        );
      }
    }
    res.json({ order: toOrder(updated as never) });
  }),
);

export default router;
