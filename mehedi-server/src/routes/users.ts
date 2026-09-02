import { Router, type Router as RouterType } from 'express';
import { UserModel } from '../models/User.js';
import { HttpError, asyncHandler } from '../lib/http.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { toUser } from '../lib/mappers.js';

const router: RouterType = Router();

router.use(requireAuth, requireRole('admin'));

// Registered people who haven't started a project yet — separate from the
// Clients list, which is role: 'client'.
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const users = await UserModel.find({ role: 'user' }).sort({ createdAt: -1 }).lean();
    res.json({ users: users.map((u) => toUser(u as never)) });
  }),
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const blocked = Boolean(req.body?.blocked);
    const updated = await UserModel.findOneAndUpdate(
      { _id: req.params.id, role: 'user' },
      { $set: { blocked } },
      { new: true },
    );
    if (!updated) throw new HttpError(404, 'User not found');
    res.json({ user: toUser(updated as never) });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const deleted = await UserModel.findOneAndDelete({ _id: req.params.id, role: 'user' });
    if (!deleted) throw new HttpError(404, 'User not found');
    res.json({ ok: true });
  }),
);

export default router;
