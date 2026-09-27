import { Router, type Router as RouterType } from "express";
import { asyncHandler, HttpError } from "../lib/http.js";
import { requireAuth } from "../middleware/auth.js";
import { InvoiceModel } from "../models/Invoice.js";
import { OrderModel } from "../models/Order.js";

const router: RouterType = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const orderId = String(req.query.orderId ?? "").trim();
    const filter: Record<string, unknown> =
      req.user!.role === "admin" ? {} : { clientId: req.user!.id };

    if (orderId) {
      const order = await OrderModel.findById(orderId)
        .select("clientId")
        .lean();
      if (
        !order ||
        (req.user!.role !== "admin" && String(order.clientId) !== req.user!.id)
      ) {
        throw new HttpError(404, "Order not found");
      }
      filter.orderId = order._id;
    }

    const invoices = await InvoiceModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    res.json({
      invoices: invoices.map((invoice) => ({
        id: String(invoice._id),
        number: invoice.number,
        projectId: String(invoice.projectId),
        orderId: invoice.orderId ? String(invoice.orderId) : null,
        clientId: String(invoice.clientId),
        items: invoice.items,
        amount: invoice.amount,
        currency: invoice.currency,
        status: invoice.status,
        dueDate: invoice.dueDate?.toISOString() ?? null,
        sentAt: invoice.sentAt?.toISOString() ?? null,
        paidAt: invoice.paidAt?.toISOString() ?? null,
        notes: invoice.notes ?? null,
        createdAt: invoice.createdAt?.toISOString() ?? new Date().toISOString(),
        updatedAt: invoice.updatedAt?.toISOString() ?? new Date().toISOString(),
      })),
    });
  }),
);

export default router;
