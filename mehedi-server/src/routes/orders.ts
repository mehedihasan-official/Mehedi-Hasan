import { Router, type Router as RouterType } from "express";
import crypto from "node:crypto";
import { Types } from "mongoose";
import { HttpError, asyncHandler } from "../lib/http.js";
import { toOrder } from "../lib/mappers.js";
import { generateOrderCode } from "../lib/orderCode.js";
import { requireAuth } from "../middleware/auth.js";
import { InvoiceModel } from "../models/Invoice.js";
import { OrderModel } from "../models/Order.js";
import { ProjectActivityModel } from "../models/ProjectActivity.js";
import { UserModel } from "../models/User.js";
import {
  manualOrderCreateSchema,
  orderCreateSchema,
  orderUpdateSchema,
  projectActivityCreateSchema,
} from "../shared/index.js";

const router: RouterType = Router();

router.use(requireAuth);

router.post(
  "/manual",
  asyncHandler(async (req, res) => {
    if (req.user!.role !== "admin") throw new HttpError(403, "Forbidden");
    const input = manualOrderCreateSchema.parse(req.body);
    const {
      clientName,
      clientEmail,
      clientWhatsapp,
      projectUrl,
      links,
      internalInfo,
      ...orderInput
    } = input;

    let client = await UserModel.findOne({ "emails.address": clientEmail });
    if (client?.role === "admin") {
      throw new HttpError(409, "An administrator account cannot be used as a project client");
    }
    if (client) {
      client.role = "client";
      client.name = clientName;
      if (clientWhatsapp) client.whatsapp = clientWhatsapp;
      await client.save();
    } else {
      client = await UserModel.create({
        role: "client",
        name: clientName,
        emails: [{ address: clientEmail, primary: true }],
        whatsapp: clientWhatsapp ?? undefined,
        source: "direct",
        active: true,
      });
    }

    const order = await OrderModel.create({
      ...orderInput,
      clientId: client._id,
      orderCode: await generateOrderCode(),
      status: "in_progress",
      progress: 0,
      projectUrl: projectUrl ?? null,
      links: links ?? {},
      internalInfo: internalInfo ?? null,
    });
    await ensureOrderInvoice(order);
    await ProjectActivityModel.create({
      orderId: order._id,
      kind: "created",
      content: "Project started manually by admin.",
      authorName: req.user!.name,
    });

    res.status(201).json({
      order: toOrder(
        order as never,
        {
          name: client.name,
          email: clientEmail,
          whatsapp: client.whatsapp,
        },
        true,
      ),
    });
  }),
);

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
    await ProjectActivityModel.create({
      orderId: order._id,
      kind: "created",
      content: "Order submitted by client.",
      authorName: req.user!.name,
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
        toOrder(o as never, clientMap.get(String(o.clientId)), true),
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

    res.json({
      order: toOrder(order as never, client, req.user!.role === "admin"),
    });
  }),
);

router.get(
  "/:id/activity",
  asyncHandler(async (req, res) => {
    if (req.user!.role !== "admin") throw new HttpError(403, "Forbidden");
    const orderId = req.params.id;
    if (!orderId || !Types.ObjectId.isValid(orderId)) {
      throw new HttpError(404, "Order not found");
    }
    const order = await OrderModel.exists({ _id: req.params.id });
    if (!order) throw new HttpError(404, "Order not found");

    const activity = await ProjectActivityModel.find({ orderId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    res.json({
      activity: activity.map((entry) => ({
        id: String(entry._id),
        kind: entry.kind,
        content: entry.content,
        authorName: entry.authorName,
        createdAt: entry.createdAt.toISOString(),
      })),
    });
  }),
);

router.post(
  "/:id/activity",
  asyncHandler(async (req, res) => {
    if (req.user!.role !== "admin") throw new HttpError(403, "Forbidden");
    const input = projectActivityCreateSchema.parse(req.body);
    const orderId = req.params.id;
    if (!orderId || !Types.ObjectId.isValid(orderId)) {
      throw new HttpError(404, "Order not found");
    }
    const order = await OrderModel.exists({ _id: req.params.id });
    if (!order) throw new HttpError(404, "Order not found");

    const entry = await ProjectActivityModel.create({
      orderId: req.params.id,
      kind: "note",
      content: input.content,
      authorName: req.user!.name,
    });
    res.status(201).json({
      entry: {
        id: String(entry._id),
        kind: entry.kind,
        content: entry.content,
        authorName: entry.authorName,
        createdAt: entry.createdAt.toISOString(),
      },
    });
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
    const changed = Object.keys(input).map((key) => {
      const labels: Record<string, string> = {
        projectName: "project name",
        status: "status",
        progress: "progress",
        budgetAmount: "budget",
        projectUrl: "project URL",
        links: "project links",
        internalInfo: "internal information",
        notes: "notes",
      };
      return labels[key] ?? key;
    });
    if (changed.length) {
      await ProjectActivityModel.create({
        orderId: updated._id,
        kind: "updated",
        content: `Updated ${changed.join(", ")}.`,
        authorName: req.user!.name,
      });
    }
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
    res.json({ order: toOrder(updated as never, null, true) });
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
