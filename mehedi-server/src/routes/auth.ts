import { Router, type Router as RouterType } from 'express';
import { firebaseAuthInputSchema } from '../shared/index.js';
import { UserModel } from '../models/User.js';
import { HttpError, asyncHandler } from '../lib/http.js';
import { verifyFirebaseToken } from '../lib/firebaseAdmin.js';
import { signToken } from '../lib/jwt.js';
import { toSessionUser } from '../lib/mappers.js';

const router: RouterType = Router();

// Registration is open: anyone with a verified Firebase identity gets an
// account. If an admin already created a placeholder client record for this
// email (manual onboarding), it gets linked here instead of duplicated.
router.post(
  '/firebase',
  asyncHandler(async (req, res) => {
    const { idToken, name } = firebaseAuthInputSchema.parse(req.body);

    let decoded;
    try {
      decoded = await verifyFirebaseToken(idToken);
    } catch {
      throw new HttpError(401, 'Invalid or expired Firebase token');
    }

    const email = (decoded.email ?? '').toLowerCase();
    if (!email) throw new HttpError(400, "Couldn't read your email from Firebase");

    let user = await UserModel.findOne({ firebaseUid: decoded.uid });
    if (!user) user = await UserModel.findOne({ 'emails.address': email });

    if (!user) {
      user = await UserModel.create({
        role: 'client',
        name: name || decoded.name || email.split('@')[0],
        emails: [{ address: email, primary: true }],
        avatar: decoded.picture ?? undefined,
        source: 'self_registered',
        active: true,
        firebaseUid: decoded.uid,
      });
    } else {
      if (!user.active) throw new HttpError(403, 'This account has been deactivated');
      if (!user.firebaseUid) user.firebaseUid = decoded.uid;
      if (decoded.picture && !user.avatar) user.avatar = decoded.picture;
      user.lastLoginAt = new Date();
      user.lastActivityAt = new Date();
      await user.save();
    }

    const sessionUser = toSessionUser(user as never);
    const token = signToken(sessionUser);
    res.json({ token, user: sessionUser });
  }),
);

export default router;
