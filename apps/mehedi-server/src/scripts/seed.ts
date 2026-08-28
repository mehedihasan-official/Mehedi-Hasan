import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { UserModel } from '../models/User.js';

type SeedClient = {
  name: string;
  emails: string[];
  phone?: string;
  whatsapp?: string;
  country?: string;
  source?: string;
  notes?: string;
};

const clients: SeedClient[] = [
  {
    name: 'Brian Caceres',
    emails: ['bcaceres@vtrsynergy.com', 'Briancaceres001@icloud.com'],
    phone: '+1 (786) 214-0890',
    whatsapp: '+17862140890',
    country: 'United States',
    source: 'direct',
    notes:
      'Biggest client. Projects: Platinum Club (travelleisure.vip), Travel+Leisure (travelclub.it.com), RCI (rcitravelleisure.com), RCI Last Call, Owner Rewards Redemption Center, Caceres Financial VTR, Empire Investments, REN, WCT Travel Portal.',
  },
  { name: 'Ibrahim Elsamra', emails: ['ibrahim.elsamra.contact@placeholder.local'], phone: '+1 (407) 360-0417', source: 'direct' },
  {
    name: 'Toufik Wyn',
    emails: ['tllahmadi@gmail.com'],
    phone: '+1 (321) 442-1418',
    source: 'direct',
  },
  { name: 'Ash', emails: ['ash.contact@placeholder.local'], notes: 'Interval-style resort platform (private), Koala-style 2-page site.', source: 'fiverr' },
  { name: 'Karen', emails: ['karen.contact@placeholder.local'], notes: 'Interval/intervalworld-style resort booking platform.', source: 'fiverr' },
  { name: 'Mark', emails: ['mark.contact@placeholder.local'], notes: 'VRBO clone (dashboard, MongoDB, Vercel), RCI resort platform.', source: 'fiverr' },
  { name: 'Rahman', emails: ['rahman.contact@placeholder.local'], notes: 'IFX Payments clone (Next.js 15, TS, Tailwind, Framer Motion).', source: 'fiverr' },
  { name: 'Salman (salman_1985)', emails: ['salman1985.contact@placeholder.local'], notes: 'DBSEE digital marketing agency site (Next.js 14, TS, 15+ pages).', source: 'fiverr' },
  { name: 'Dennis', emails: ['dennis.contact@placeholder.local'], notes: 'Invoice forwarding SaaS MVP (Gmail/Outlook OAuth, cron, Mollie).', source: 'fiverr' },
  { name: 'Bruno (Maria)', emails: ['Mariatorsan0415@gmail.com'], notes: 'MERN Development project.', source: 'fiverr' },
  { name: 'Ashraf Zaman', emails: ['ashraf.zaman.contact@placeholder.local'], notes: 'WordPress project.', source: 'fiverr' },
  { name: 'Oliver', emails: ['oliver.contact@placeholder.local'], notes: 'Email Finder Tool — Figma to Elementor (emailfindertool.com).', source: 'fiverr' },
  { name: 'Betexposure', emails: ['betexposure.contact@placeholder.local'], notes: 'Betexposure website (betexposure.com).', source: 'fiverr' },
  { name: 'Tayieb', emails: ['tayieb.contact@placeholder.local'], notes: 'WordPress — Add Variations.', source: 'fiverr' },
  { name: 'Additio', emails: ['additio.contact@placeholder.local'], notes: 'WordPress site (additio.si).', source: 'fiverr' },
  { name: 'Al Hyari', emails: ['alhyari.contact@placeholder.local'], notes: 'WordPress site (alhyari.art).', source: 'fiverr' },
  { name: 'Micheal', emails: ['micheal.contact@placeholder.local'], notes: 'Keon Mauritius HTML site (keon.mu).', source: 'fiverr' },
  { name: 'Liz', emails: ['liz.contact@placeholder.local'], notes: 'Insurance consultant website ($850, Next.js, black/gold).', source: 'fiverr' },
  { name: 'Ashton', emails: ['ashton.contact@placeholder.local'], notes: 'Insurance consultant website ($850, Next.js, black/gold).', source: 'fiverr' },
  { name: 'Farjana / Yasmin', emails: ['farjana.yasmin.contact@placeholder.local'], notes: 'Airbnb-style app.', source: 'fiverr' },
];

async function main(): Promise<void> {
  await connectDatabase();

  const existingAdmin = await UserModel.findOne({ role: 'admin', 'emails.address': env.ADMIN_EMAIL.toLowerCase() });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
    await UserModel.create({
      role: 'admin',
      name: env.ADMIN_NAME,
      emails: [{ address: env.ADMIN_EMAIL, primary: true, label: 'Primary' }],
      passwordHash,
      country: 'Bangladesh',
      timezone: 'Asia/Dhaka',
      active: true,
    });
    logger.info(`Seeded admin ${env.ADMIN_EMAIL}`);
  } else {
    logger.info('Admin already exists — skipping');
  }

  for (const c of clients) {
    const primary = c.emails[0]!.toLowerCase();
    const exists = await UserModel.findOne({ 'emails.address': primary });
    if (exists) continue;
    await UserModel.create({
      role: 'client',
      name: c.name,
      emails: c.emails.map((address, i) => ({ address, primary: i === 0 })),
      phone: c.phone,
      whatsapp: c.whatsapp,
      country: c.country,
      source: c.source,
      notes: c.notes,
      active: true,
    });
    logger.info(`Seeded client ${c.name}`);
  }

  await disconnectDatabase();
  logger.info('Seed complete');
}

main().catch((err) => {
  logger.error({ err }, 'Seed failed');
  process.exit(1);
});
