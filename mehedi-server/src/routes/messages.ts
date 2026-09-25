import { Router, type Router as RouterType } from "express";
import { HttpError, asyncHandler } from "../lib/http.js";
import { requireAuth } from "../middleware/auth.js";
import { MessageModel } from "../models/Message.js";
import { OrderModel } from "../models/Order.js";
import { UserModel } from "../models/User.js";
import { messageCreateSchema } from "../shared/index.js";

const router: RouterType = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const filter =
      req.user!.role === "admin" ? {} : { fromUserId: req.user!.id };
    const messages = await MessageModel.find(filter)
      .sort({ createdAt: 1 })
      .lean();
    res.json({
      messages: messages.map((message) => ({
        id: String(message._id),
        projectId: String(message.projectId),
        fromUserId: String(message.fromUserId),
        toUserId: String(message.toUserId),
        body: message.body,
        createdAt: message.createdAt?.toISOString() ?? new Date().toISOString(),
        readAt: message.readAt
          ? new Date(message.readAt as unknown as string).toISOString()
          : null,
      })),
    });
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = messageCreateSchema.parse(req.body);
    const order = await OrderModel.findById(input.projectId).lean();
    if (
      !order ||
      (req.user!.role !== "admin" && String(order.clientId) !== req.user!.id)
    )
      throw new HttpError(404, "Order not found");
    const admin = await UserModel.findOne({ role: "admin", active: true })
      .select("_id")
      .lean();
    if (!admin) throw new HttpError(503, "No admin recipient is available");
    const message = await MessageModel.create({
      projectId: order._id,
      fromUserId: req.user!.id,
      toUserId: admin._id,
      body: input.body,
      fileIds: input.fileIds,
    });
    res.status(201).json({
      message: {
        id: String(message._id),
        projectId: String(message.projectId),
        fromUserId: String(message.fromUserId),
        toUserId: String(message.toUserId),
        body: message.body,
        createdAt: message.createdAt?.toISOString() ?? new Date().toISOString(),
        readAt: null,
      },
    });
  }),
);

export default router;
