# Mehedi Hasan — Personal Brand + Client Management Platform

Two projects in one repo:

- **[mehedi-client/](mehedi-client)** — the Next.js 15 frontend (public site + client dashboard + admin CMS)
- **[mehedi-server/](mehedi-server)** — the Express + MongoDB backend API

Each project is fully standalone with its own `package.json` and `npm run dev` command.

## Local development

Open two terminals — one for each project.

### 1. Start the server (backend)

```bash
cd mehedi-server
cp .env.example .env    # fill in MONGODB_URI, JWT_SECRET, ADMIN_PASSWORD, etc.
npm install
npm run seed            # creates the admin + real clients in MongoDB (first time only)
npm run dev             # runs at http://localhost:4000
```

### 2. Start the client (frontend)

```bash
cd mehedi-client
cp .env.example .env.local   # fill in NEXTAUTH_SECRET (must match server JWT_SECRET), etc.
npm install
npm run dev                  # runs at http://localhost:3000
```

Then open <http://localhost:3000/login> and sign in as the admin email you set (default `skmehedihasan.jr1@gmail.com`) with the `ADMIN_PASSWORD` you chose.

## Shared code

Both projects have their own `src/shared/` folder with matching Zod schemas and TypeScript types. **Keep them in sync** — when you change a schema in one project, copy the change to the other. The files are identical.

## Deployment

- **mehedi-client** → Vercel (root directory = `mehedi-client`)
- **mehedi-server** → Railway (root directory = `mehedi-server`)
- **Database** → MongoDB Atlas
- **Files** → Cloudinary
- **Email** → Resend

Push to `main` and Vercel auto-deploys the client.

## Stack

Next.js 15 · React 19 · TypeScript strict · Tailwind CSS v4 · shadcn-style UI · Framer Motion · NextAuth v5 · Express · Mongoose · MongoDB · Cloudinary · Resend · Calendly · TanStack Query · Socket.io · Recharts
