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
    await ensureOrderInvoice(order);

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
    let invoice = await InvoiceModel.findOne({ orderId: updated._id });
    if (
      !invoice &&
      (updated.status === "accepted" || updated.status === "in_progress")
    ) {
      invoice = await ensureOrderInvoice(updated);
    }
    if (invoice?.status === "draft" && input.budgetAmount !== undefined) {
      const amount = updated.budgetAmount ?? 0;
      await InvoiceModel.updateOne(
        { _id: invoice._id, status: "draft" },
        {
          $set: {
            amount,
            "items.0.rate": amount,
            notes: amount
              ? null
              : "Set the agreed project price before sending this invoice.",
          },
        },
      );
    }
    res.json({ order: toOrder(updated as never) });
  }),
);

async function ensureOrderInvoice(order: {
  _id: unknown;
  budgetAmount?: number | null;
  serviceType: string;
  clientId: unknown;
}) {
  const amount = order.budgetAmount ?? 0;
  const service = String(order.serviceType).replaceAll("_", " ");
  return InvoiceModel.findOneAndUpdate(
    { orderId: order._id },
    {
      $setOnInsert: {
        number: `INV-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
        projectId: order._id,
        orderId: order._id,
        clientId: order.clientId,
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
}

export default router;
