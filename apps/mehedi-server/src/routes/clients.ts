import { Router, type Router as RouterType } from 'express';
import crypto from 'node:crypto';
import { clientCreateSchema, clientUpdateSchema } from '@mehedi/shared';
import { UserModel } from '../models/User.js';
import { ProjectModel } from '../models/Project.js';
import { InvoiceModel } from '../models/Invoice.js';
import { HttpError, asyncHandler } from '../lib/http.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { toClient } from '../lib/mappers.js';

const router: RouterType = Router();

router.use(requireAuth, requireRole('admin'));

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const q = String(req.query.q ?? '').trim();
    const filter: Record<string, unknown> = { role: 'client' };
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { 'emails.address': { $regex: q, $options: 'i' } },
      ];
    }
    const clients = await UserModel.find(filter).sort({ lastActivityAt: -1, createdAt: -1 }).lean();

    const ids = clients.map((c) => c._id);
    const [projectCounts, invoiceTotals] = await Promise.all([
      ProjectModel.aggregate([
        { $match: { clientId: { $in: ids }, status: { $in: ['planning', 'active', 'delivered'] } } },
        { $group: { _id: '$clientId', n: { $sum: 1 } } },
      ]),
      InvoiceModel.aggregate([
        { $match: { clientId: { $in: ids }, status: 'paid' } },
        { $group: { _id: '$clientId', total: { $sum: '$amount' } } },
      ]),
    ]);

    const countMap = new Map<string, number>(projectCounts.map((p) => [String(p._id), p.n]));
    const totalMap = new Map<string, number>(invoiceTotals.map((i) => [String(i._id), i.total]));

    res.json({
      clients: clients.map((c) =>
        toClient(c as never, {
          activeProjectCount: countMap.get(String(c._id)) ?? 0,
          lifetimeValue: totalMap.get(String(c._id)) ?? 0,
        }),
      ),
    });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const client = await UserModel.findOne({ _id: req.params.id, role: 'client' }).lean();
    if (!client) throw new HttpError(404, 'Client not found');

    const [activeCount, paidAgg] = await Promise.all([
      ProjectModel.countDocuments({
        clientId: client._id,
        status: { $in: ['planning', 'active', 'delivered'] },
      }),
      InvoiceModel.aggregate([
        { $match: { clientId: client._id, status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    res.json({
      client: toClient(client as never, {
        activeProjectCount: activeCount,
        lifetimeValue: paidAgg[0]?.total ?? 0,
      }),
    });
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const input = clientCreateSchema.parse(req.body);
    ensureOnePrimary(input.emails);
    const inviteToken = crypto.randomBytes(24).toString('hex');
    const inviteTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const created = await UserModel.create({
      role: 'client',
      name: input.name,
      emails: input.emails,
      phone: input.phone,
      whatsapp: input.whatsapp,
      address: input.address,
      timezone: input.timezone,
      country: input.country,
      source: input.source,
      notes: input.notes,
      avatar: input.avatar,
      active: true,
      inviteToken,
      inviteTokenExpires,
    });

    res.status(201).json({ client: toClient(created as never), inviteToken });
  }),
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const input = clientUpdateSchema.parse(req.body);
    if (input.emails) ensureOnePrimary(input.emails);
    const updated = await UserModel.findOneAndUpdate(
      { _id: req.params.id, role: 'client' },
      { $set: input },
      { new: true, runValidators: true },
    );
    if (!updated) throw new HttpError(404, 'Client not found');
    res.json({ client: toClient(updated as never) });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const updated = await UserModel.findOneAndUpdate(
      { _id: req.params.id, role: 'client' },
      { $set: { active: false } },
      { new: true },
    );
    if (!updated) throw new HttpError(404, 'Client not found');
    res.json({ client: toClient(updated as never) });
  }),
);

function ensureOnePrimary(emails: Array<{ primary?: boolean }>): void {
  const primaries = emails.filter((e) => e.primary).length;
  if (primaries === 0) emails[0]!.primary = true;
  if (primaries > 1) throw new HttpError(400, 'Only one email can be primary');
}

export default router;
