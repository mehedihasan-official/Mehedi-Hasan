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
      .sort({ createdAt: -1 })
      .lean();
    const userIds = [
      ...new Set(
        messages.flatMap((message) => [
          String(message.fromUserId),
          String(message.toUserId),
        ]),
      ),
    ];
    const projectIds = [
      ...new Set(messages.map((message) => String(message.projectId))),
    ];
    const [users, orders] = await Promise.all([
      UserModel.find({ _id: { $in: userIds } })
        .select("name avatar")
        .lean(),
      OrderModel.find({ _id: { $in: projectIds } })
        .select("orderCode serviceType clientId")
        .lean(),
    ]);
    const userMap = new Map(users.map((user) => [String(user._id), user]));
    const orderMap = new Map(orders.map((order) => [String(order._id), order]));
    res.json({
      unread:
        req.user!.role === "admin"
          ? messages.filter(
              (message) =>
                String(message.toUserId) === req.user!.id && !message.readAt,
            ).length
          : messages.filter(
              (message) =>
                String(message.toUserId) === req.user!.id && !message.readAt,
            ).length,
      messages: messages.map((message) =>
        toMessage(
          message as Record<string, unknown>,
          userMap,
          orderMap,
          req.user!.id,
        ),
      ),
    });
  }),
);

router.get(
  "/project/:projectId",
  asyncHandler(async (req, res) => {
    const order = await OrderModel.findById(req.params.projectId).lean();
    if (
      !order ||
      (req.user!.role !== "admin" && String(order.clientId) !== req.user!.id)
    ) {
      throw new HttpError(404, "Order not found");
    }
    if (req.user!.role === "admin") {
      await MessageModel.updateMany(
        {
          projectId: order._id,
          toUserId: req.user!.id,
          readAt: { $exists: false },
        },
        { $set: { readAt: new Date() } },
      );
    }
    const messages = await MessageModel.find({ projectId: order._id })
      .sort({ createdAt: 1 })
      .lean();
    const userIds = [
      ...new Set(
        messages.flatMap((message) => [
          String(message.fromUserId),
          String(message.toUserId),
        ]),
      ),
    ];
    const users = await UserModel.find({ _id: { $in: userIds } })
      .select("name avatar")
      .lean();
    const userMap = new Map(users.map((user) => [String(user._id), user]));
    const orderMap = new Map([[String(order._id), order]]);
    res.json({
      order: {
        id: String(order._id),
        orderCode: order.orderCode,
        serviceType: order.serviceType,
      },
      messages: messages.map((message) =>
        toMessage(
          message as Record<string, unknown>,
          userMap,
          orderMap,
          req.user!.id,
        ),
      ),
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
    const recipient =
      req.user!.role === "admin"
        ? String(order.clientId)
        : (
            await UserModel.findOne({ role: "admin", active: true })
              .select("_id")
              .lean()
          )?._id;
    if (!recipient)
      throw new HttpError(503, "No message recipient is available");
    const message = await MessageModel.create({
      projectId: order._id,
      fromUserId: req.user!.id,
      toUserId: recipient,
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

function toMessage(
  message: Record<string, unknown>,
  userMap: Map<string, { name?: string; avatar?: string | null }>,
  orderMap: Map<string, { orderCode?: string; serviceType?: string }>,
  viewerId: string,
) {
  const sender = userMap.get(String(message.fromUserId));
  const order = orderMap.get(String(message.projectId));
  return {
    id: String(message._id),
    projectId: String(message.projectId),
    fromUserId: String(message.fromUserId),
    toUserId: String(message.toUserId),
    senderName: sender?.name ?? "Unknown user",
    senderAvatar: sender?.avatar ?? null,
    projectCode: order?.orderCode ?? "Unknown order",
    projectService: order?.serviceType ?? null,
    body: String(message.body ?? ""),
    createdAt:
      message.createdAt instanceof Date
        ? message.createdAt.toISOString()
        : new Date().toISOString(),
    readAt: message.readAt
      ? new Date(message.readAt as string).toISOString()
      : null,
    unread: String(message.toUserId) === viewerId && !message.readAt,
  };
}

export default router;
