# Deploy to Vercel

You will create **two separate Vercel projects** from the same GitHub repo — one for the frontend (`mehedi-client`), one for the backend (`mehedi-server`). This is the standard pattern for a repo with two apps in subfolders.

Deploy the **server first**, then the client (the client needs the server's URL as an env var).

---

## Prerequisites

- MongoDB Atlas cluster with connection string ready
- (Optional) Resend, Google OAuth, Cloudinary credentials

---

## Part 1 — Deploy the server (`mehedi-server`)

1. Go to <https://vercel.com/new> and import the `Mehedi-Hasan` repo.
2. In the "Configure Project" screen:
   - **Project Name**: `mehedi-server` (or whatever you like)
   - **Root Directory**: click **Edit** → select **`mehedi-server`** ⚠️ this is the most important step
   - **Framework Preset**: leave as "Other" (Vercel will pick it up via `vercel.json`)
   - **Build Command**: leave default (empty — `vercel.json` handles it)
   - **Output Directory**: leave default
   - **Install Command**: leave default (`npm install`)
3. Expand **Environment Variables** and add:

   | Key             | Value                                                                                     |
   | --------------- | ----------------------------------------------------------------------------------------- |
   | `MONGODB_URI`   | your MongoDB Atlas connection string (must include `/mehedi_platform` as the DB name)     |
   | `JWT_SECRET`    | a long random string (generate: `openssl rand -base64 32`) — **remember this value**       |
   | `ADMIN_EMAIL`   | `skmehedihasan.jr1@gmail.com`                                                             |
   | `ADMIN_NAME`    | `Mehedi Hasan`                                                                            |
   | `ADMIN_PASSWORD`| a strong password — this is your first login                                              |
   | `CORS_ORIGINS`  | leave empty for now; you'll fill it after the client is deployed                          |
   | `NODE_ENV`      | `production`                                                                              |

4. Click **Deploy**. Wait for it to finish.
5. Once deployed, note the URL (e.g. `https://mehedi-server-abc123.vercel.app`). Test it: opening the URL should return `{"ok":true,"service":"mehedi-server"}`.

### Seed the database (one-time, from your laptop)

Vercel serverless can't run long scripts, so seed locally against Atlas:

```bash
cd mehedi-server
cp .env.example .env
# Edit .env — set MONGODB_URI to the Atlas string, ADMIN_PASSWORD to whatever you used on Vercel
npm install
npm run seed
```

You should see logs saying "Seeded admin" and "Seeded client Brian Caceres" etc.

---

## Part 2 — Deploy the client (`mehedi-client`)

1. Go to <https://vercel.com/new> and import the **same** `Mehedi-Hasan` repo again.
2. In the "Configure Project" screen:
   - **Project Name**: `mehedi-client`
   - **Root Directory**: click **Edit** → select **`mehedi-client`** ⚠️ critical
   - **Framework Preset**: Vercel auto-detects Next.js — leave it
   - **Build/Install/Output**: leave defaults
3. Expand **Environment Variables** and add:

   | Key                          | Value                                                                    |
   | ---------------------------- | ------------------------------------------------------------------------ |
   | `NEXTAUTH_SECRET`            | **same value** you used for `JWT_SECRET` on the server                   |
   | `NEXTAUTH_URL`               | leave empty (Vercel sets `VERCEL_URL` automatically; NextAuth uses that) |
   | `API_URL`                    | the server URL from Part 1, e.g. `https://mehedi-server-abc123.vercel.app` |
   | `NEXT_PUBLIC_API_URL`        | same as `API_URL`                                                        |
   | `NEXT_PUBLIC_APP_URL`        | leave empty for now; add your production domain if you have one          |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER`| your WhatsApp number, digits only e.g. `8801XXXXXXXXX`                   |
   | `NEXT_PUBLIC_CALENDLY_URL`   | your Calendly booking link (optional)                                    |
   | `GOOGLE_CLIENT_ID`           | (optional) Google OAuth client ID                                        |
   | `GOOGLE_CLIENT_SECRET`       | (optional) Google OAuth client secret                                    |

4. Click **Deploy**.
5. Once deployed, note the URL (e.g. `https://mehedi-client-xyz.vercel.app`).

---

## Part 3 — Wire CORS on the server

Now that you know the client's URL, go back to the **server project** in Vercel:

1. **Settings → Environment Variables**
2. Edit `CORS_ORIGINS`:
   - Paste the client URL from Part 2, comma-separated if multiple: `https://mehedi-client-xyz.vercel.app,https://your-custom-domain.com`
   - Preview deployments on `*.vercel.app` are auto-allowed if at least one vercel.app origin is in the list.
3. **Deployments → latest → ⋯ → Redeploy** (env changes need a redeploy).

---

## Part 4 — Test it

1. Open the client URL in a browser.
2. Public pages should render: `/`, `/about`, `/services`, `/work`, `/contact`, `/start-project`.
3. Go to `/login`, sign in with `skmehedihasan.jr1@gmail.com` and the `ADMIN_PASSWORD` you set.
4. You should land on `/admin` and see the KPI dashboard. Click **Clients** — the 20 seeded clients should appear as cards.

---

## Custom domains (later)

- Add your domain to the **client** project in Vercel (Settings → Domains). No change needed to `mehedi-server` unless the server also gets its own subdomain (e.g. `api.mehedihasan.dev`).
- Update `CORS_ORIGINS` on the server to include the new domain.
- Update `NEXT_PUBLIC_APP_URL` and `NEXTAUTH_URL` on the client to the new domain.

---

## Troubleshooting

**Build fails: "MONGODB_URI is required"**
The server tries to validate env at import time. Make sure `MONGODB_URI` is set in the Vercel project's env vars for **Production**, **Preview**, and **Development** (all three checkboxes).

**Login says "Invalid email or password" even with the right password**
The client's authorize callback runs on Vercel and fetches `API_URL/auth/login`. Check:
- `API_URL` in the client project is set to the server's URL (no trailing slash).
- The server is actually deployed and returns `{"ok":true}` at its root URL.
- Server logs (Vercel dashboard → server project → Logs) show any errors.

**CORS errors in browser console**
The server's `CORS_ORIGINS` must include the client's URL exactly (protocol + host, no trailing slash). Redeploy the server after changing it.

**"Can't reach the API" empty state on `/admin/clients`**
This is the graceful fallback — the server is down or unreachable from the client's runtime. Check:
- Server deployment status.
- `API_URL` on the client points at the server.
- Try opening `${API_URL}/health` in a new tab — should return `{"ok":true}`.

**Cold-start latency**
Vercel serverless spins down after inactivity. The first request after a cold start takes a few seconds. This is normal.

**Real-time messages (later)**
Socket.io needs a persistent connection which Vercel serverless does not support. When we add real-time messaging in Phase 2, either the server will move to Railway/Render, or we'll use a serverless-friendly service like Pusher/Ably.
