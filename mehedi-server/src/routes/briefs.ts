import { Router, type Router as RouterType } from 'express';
import { briefCreateSchema, briefUpdateSchema } from '../shared/index.js';
import { BriefModel } from '../models/Brief.js';
import { OrderModel } from '../models/Order.js';
import { UserModel } from '../models/User.js';
import { HttpError, asyncHandler } from '../lib/http.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.js';
import { generateOrderCode } from '../lib/orderCode.js';
import { createOrGetFirebaseUser } from '../lib/firebaseAdmin.js';
import { toBrief } from '../lib/mappers.js';

const router: RouterType = Router();

// The temporary password given to accounts auto-created from a brief
// submission. The frontend signs the person straight in with it and sends
// them to set a real one — never shown to anyone but them, once.
const DEFAULT_PASSWORD = '123456';

// Public — this is what /start-project submits to. optionalAuth links the
// brief to the submitter's account when they're logged in. If they're
// anonymous and this email isn't registered yet, an account is created for
// them on the spot so they land on a dashboard right away instead of a dead
// end. `accountStatus` tells the frontend what happened so it can react:
// 'linked' (already logged in), 'created' (brand new, needs a real
// password), or 'existing' (this email already has an account — log in).
router.post(
  '/',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const input = briefCreateSchema.parse(req.body);
    const email = input.email.toLowerCase();

    let userId = req.user?.id ?? null;
    let accountStatus: 'linked' | 'created' | 'existing' = userId ? 'linked' : 'existing';

    if (!userId) {
      const existing = await UserModel.findOne({ 'emails.address': email });
      if (existing) {
        userId = String(existing._id);
      } else {
        const { uid } = await createOrGetFirebaseUser(email, DEFAULT_PASSWORD, input.name);
        const created = await UserModel.create({
          role: 'user',
          name: input.name,
          emails: [{ address: email, primary: true }],
          phone: input.phone,
          whatsapp: input.whatsapp,
          source: 'contact_form',
          active: true,
          firebaseUid: uid,
        });
        userId = String(created._id);
        accountStatus = 'created';
      }
    }

    const brief = await BriefModel.create({ ...input, userId });
    res.status(201).json({ brief: toBrief(brief as never), accountStatus });
  }),
);

// A logged-in visitor's own briefs, for their dashboard.
router.get(
  '/mine',
  requireAuth,
  asyncHandler(async (req, res) => {
    const briefs = await BriefModel.find({ userId: req.user!.id }).sort({ createdAt: -1 }).lean();
    res.json({ briefs: briefs.map((b) => toBrief(b as never)) });
  }),
);

router.get(
  '/',
  requireAuth,
  requireRole('admin'),
  asyncHandler(async (_req, res) => {
    const briefs = await BriefModel.find().sort({ createdAt: -1 }).lean();
    res.json({ briefs: briefs.map((b) => toBrief(b as never)) });
  }),
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const input = briefUpdateSchema.parse(req.body);
    const updated = await BriefModel.findByIdAndUpdate(req.params.id, { $set: input }, { new: true });
    if (!updated) throw new HttpError(404, 'Brief not found');
    res.json({ brief: toBrief(updated as never) });
  }),
);

// Turns a brief into a real order once the conversation with the client is
// done. Only works for briefs submitted while logged in — an anonymous
// brief has no account to attach the order to.
router.post(
  '/:id/start-order',
  requireAuth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const brief = await BriefModel.findById(req.params.id);
    if (!brief) throw new HttpError(404, 'Brief not found');
    if (brief.orderId) throw new HttpError(400, 'This brief already has an order');
    if (!brief.userId) {
      throw new HttpError(
        400,
        'This brief has no linked account — the person needs to register first before an order can be started for them.',
      );
    }

    const orderCode = await generateOrderCode();
    const order = await OrderModel.create({
      clientId: brief.userId,
      orderCode,
      serviceType: brief.serviceType,
      budgetRange: brief.budgetRange,
      timeline: brief.timeline,
      description: brief.message || `Started from brief: ${brief.name}`,
      status: 'accepted',
    });

    brief.status = 'converted';
    brief.orderId = order._id;
    await brief.save();

    await UserModel.findOneAndUpdate({ _id: brief.userId, role: 'user' }, { $set: { role: 'client' } });

    res.status(201).json({ brief: toBrief(brief as never), orderId: String(order._id) });
  }),
);

export default router;
