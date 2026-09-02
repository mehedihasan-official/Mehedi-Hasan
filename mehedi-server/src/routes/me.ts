import { Router, type Router as RouterType } from 'express';
import { meUpdateSchema } from '../shared/index.js';
import { UserModel } from '../models/User.js';
import { HttpError, asyncHandler } from '../lib/http.js';
import { requireAuth } from '../middleware/auth.js';
import { toClient, toSessionUser } from '../lib/mappers.js';

const router: RouterType = Router();

router.use(requireAuth);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user!.id);
    if (!user) throw new HttpError(404, 'User not found');
    // Every account gets its own profile shape here, not just clients — a
    // plain "user" still needs to see/edit their contact details.
    res.json({ user: toSessionUser(user as never), profile: toClient(user as never) });
  }),
);

router.patch(
  '/',
  asyncHandler(async (req, res) => {
    const input = meUpdateSchema.parse(req.body);
    const updated = await UserModel.findByIdAndUpdate(req.user!.id, { $set: input }, { new: true });
    if (!updated) throw new HttpError(404, 'User not found');
    res.json({ user: toSessionUser(updated as never), profile: toClient(updated as never) });
  }),
);

export default router;
