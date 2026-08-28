import { Router, type Router as RouterType } from 'express';
import { leadCreateSchema } from '@mehedi/shared';
import { LeadModel } from '../models/Lead.js';
import { asyncHandler } from '../lib/http.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router: RouterType = Router();

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const input = leadCreateSchema.parse(req.body);
    const lead = await LeadModel.create(input);
    res.status(201).json({ lead });
  }),
);

router.get(
  '/',
  requireAuth,
  requireRole('admin'),
  asyncHandler(async (_req, res) => {
    const leads = await LeadModel.find().sort({ createdAt: -1 }).lean();
    res.json({ leads });
  }),
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const updated = await LeadModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ lead: updated });
  }),
);

export default router;
