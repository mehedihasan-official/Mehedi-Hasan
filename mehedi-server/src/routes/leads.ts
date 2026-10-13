import { Router, type Router as RouterType } from 'express';
import { LeadModel } from '../models/Lead.js';
import { HttpError, asyncHandler } from '../lib/http.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { leadCreateSchema } from '../shared/index.js';

const router: RouterType = Router();

router.use(requireAuth, requireRole('admin'));

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const leads = await LeadModel.find().sort({ createdAt: -1 }).lean();
    res.json({
      leads: leads.map((lead) => ({
        id: String(lead._id),
        email: lead.email,
        name: lead.name ?? null,
        source: lead.source,
        lastLoginAt: lead.lastLoginAt?.toISOString() ?? null,
        createdAt: lead.createdAt.toISOString(),
      })),
    });
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const input = leadCreateSchema.parse(req.body);
    const existing = await LeadModel.findOne({ email: input.email }).lean();
    if (existing) throw new HttpError(409, 'A lead with this email already exists');

    const lead = await LeadModel.create({
      email: input.email,
      source: 'manual',
    });
    res.status(201).json({
      lead: {
        id: String(lead._id),
        email: lead.email,
        name: lead.name ?? null,
        source: lead.source,
        lastLoginAt: lead.lastLoginAt?.toISOString() ?? null,
        createdAt: lead.createdAt.toISOString(),
      },
    });
  }),
);

export default router;
