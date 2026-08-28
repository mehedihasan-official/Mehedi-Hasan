# Mehedi Hasan — Personal Brand + Client Management Platform

One platform, three surfaces:

- **Public site** — portfolio, services, case studies, "start a project" flow
- **Client dashboard** — projects, stages, files, invoices, WhatsApp + in-app messages
- **Admin CMS** — client, project, lead, invoice, portfolio management (Mehedi only)

## Monorepo

```
Mehedi-Hasan/
├── apps/
│   ├── mehedi-client/     Next.js 15 (public + client + admin, gated by role)
│   └── mehedi-server/     Express + TypeScript + Mongoose + Socket.io
└── packages/
    └── shared/            Zod schemas, TS types, enums shared by web + server
```

## Local development

```bash
pnpm install
cp .env.example .env
# fill in .env values
pnpm dev
```

- Web: <http://localhost:3000>
- API: <http://localhost:4000>

## Scripts

| Command             | What it does                                |
| ------------------- | ------------------------------------------- |
| `pnpm dev`          | Run web + api together                      |
| `pnpm dev:web`      | Run Next.js only                            |
| `pnpm dev:api`      | Run Express only                            |
| `pnpm build`        | Build everything                            |
| `pnpm lint`         | Lint everything                             |
| `pnpm typecheck`    | Typecheck everything                        |
| `pnpm seed`         | Seed MongoDB with admin user + real clients |

## Stack

Next.js 15 · React 19 · TypeScript strict · Tailwind CSS v4 · shadcn/ui · Framer Motion · NextAuth v5 · Express · Mongoose · MongoDB Atlas · Cloudinary · Resend · Calendly · TanStack Query · Socket.io · Recharts

## Deployment

- **Web** → Vercel (auto-deploy from `main`)
- **API** → Railway
- **DB** → MongoDB Atlas
- **Files** → Cloudinary
