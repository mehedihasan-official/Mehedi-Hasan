import { Router, type Router as RouterType } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { loginInputSchema, inviteAcceptSchema } from '../shared/index.js';
import { UserModel } from '../models/User.js';
import { HttpError, asyncHandler } from '../lib/http.js';
import { signToken } from '../lib/jwt.js';
import { toSessionUser } from '../lib/mappers.js';

const router: RouterType = Router();

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = loginInputSchema.parse(req.body);
    const user = await UserModel.findOne({ 'emails.address': email.toLowerCase() });
    if (!user || !user.passwordHash || !user.active) {
      throw new HttpError(401, 'Invalid email or password');
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new HttpError(401, 'Invalid email or password');

    user.lastLoginAt = new Date();
    user.lastActivityAt = new Date();
    await user.save();

    const sessionUser = toSessionUser(user);
    const token = signToken(sessionUser);
    res.json({ token, user: sessionUser });
  }),
);

// Called from NextAuth's Google signIn callback. We only issue a token if the
// Google email matches an existing invited user. Random Gmails are rejected —
// this preserves the invite-only model while letting real clients skip typing
// their password every time.
const googleLookupSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  image: z.string().url().optional(),
});

router.post(
  '/google-callback',
  asyncHandler(async (req, res) => {
    const { email, image } = googleLookupSchema.parse(req.body);
    const user = await UserModel.findOne({ 'emails.address': email.toLowerCase() });
    if (!user || !user.active) {
      throw new HttpError(
        403,
        "Your Google account isn't linked to a client here. Please contact Mehedi to get invited.",
      );
    }

    // Auto-adopt the Google profile picture on first Google login
    if (image && !user.avatar) user.avatar = image;
    user.lastLoginAt = new Date();
    user.lastActivityAt = new Date();
    await user.save();

    const sessionUser = toSessionUser(user);
    const token = signToken(sessionUser);
    res.json({ token, user: sessionUser });
  }),
);

router.post(
  '/accept-invite',
  asyncHandler(async (req, res) => {
    const { token, password, name } = inviteAcceptSchema.parse(req.body);
    const user = await UserModel.findOne({
      inviteToken: token,
      inviteTokenExpires: { $gt: new Date() },
    });
    if (!user) throw new HttpError(400, 'Invite token is invalid or expired');

    user.passwordHash = await bcrypt.hash(password, 12);
    user.inviteToken = undefined;
    user.inviteTokenExpires = undefined;
    if (name) user.name = name;
    user.active = true;
    user.lastLoginAt = new Date();
    await user.save();

    const sessionUser = toSessionUser(user);
    const authToken = signToken(sessionUser);
    res.json({ token: authToken, user: sessionUser });
  }),
);

export default router;
