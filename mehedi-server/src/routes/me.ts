import { Router, type Router as RouterType } from 'express';
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
    res.json({
      user: toSessionUser(user as never),
      profile: user.role === 'client' ? toClient(user as never) : null,
    });
  }),
);

export default router;
