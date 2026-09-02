# Deploy to Vercel

You will create **two separate Vercel projects** from the same GitHub repo — one for the frontend (`mehedi-client`), one for the backend (`mehedi-server`). This is the standard pattern for a repo with two apps in subfolders.

Deploy the **server first**, then the client (the client needs the server's URL as an env var).

---

## Prerequisites

- MongoDB Atlas cluster with connection string ready
- A Firebase project with **Email/Password** and **Google** sign-in providers enabled
  (Firebase Console → Authentication → Sign-in method), the web app config (Project Settings →
  General → Your apps), and a service-account key (Project Settings → Service Accounts → Generate
  new private key)
- (Optional) Resend, Cloudinary credentials

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
   | `MONGODB_URI`          | your MongoDB Atlas connection string (must include `/mehedi_platform` as the DB name) |
   | `JWT_SECRET`           | a long random string (generate: `openssl rand -base64 32`) — **remember this value**   |
   | `ADMIN_EMAIL`          | `skmehedihasan.jr1@gmail.com`                                                         |
   | `ADMIN_NAME`           | `Mehedi Hasan`                                                                        |
   | `FIREBASE_PROJECT_ID`  | from the Firebase service-account JSON                                               |
   | `FIREBASE_CLIENT_EMAIL`| from the Firebase service-account JSON                                               |
   | `FIREBASE_PRIVATE_KEY` | from the Firebase service-account JSON (keep the `\n` escapes, wrap in quotes)        |
   | `CORS_ORIGINS`         | leave empty for now; you'll fill it after the client is deployed                      |
   | `NODE_ENV`             | `production`                                                                          |

4. Click **Deploy**. Wait for it to finish.
5. Once deployed, note the URL (e.g. `https://mehedi-server-abc123.vercel.app`). Test it: opening the URL should return `{"ok":true,"service":"mehedi-server"}`.

### Seed the database (one-time, from your laptop)

Vercel serverless can't run long scripts, so seed locally against Atlas:

```bash
cd mehedi-server
cp .env.example .env
# Edit .env — set MONGODB_URI to the Atlas string and the same FIREBASE_* values you used on Vercel
npm install
npm run seed
```

You should see logs saying "Seeded admin" and "Seeded client Brian Caceres" etc. The seeded admin
has no password — sign in by registering/logging in with `ADMIN_EMAIL` via Firebase (email/password
or Google) and the backend links it to this record automatically on first login.

---

## Part 2 — Deploy the client (`mehedi-client`)

1. Go to <https://vercel.com/new> and import the **same** `Mehedi-Hasan` repo again.
2. In the "Configure Project" screen:
   - **Project Name**: `mehedi-client`
   - **Root Directory**: click **Edit** → select **`mehedi-client`** ⚠️ critical
   - **Framework Preset**: Vercel auto-detects Next.js — leave it
   - **Build/Install/Output**: leave defaults
3. Expand **Environment Variables** and add:

   | Key                                    | Value                                                                    |
   | --------------------------------------- | ------------------------------------------------------------------------ |
   | `JWT_SECRET`                             | **same value** you used for `JWT_SECRET` on the server                   |
   | `API_URL`                                | the server URL from Part 1, e.g. `https://mehedi-server-abc123.vercel.app` |
   | `NEXT_PUBLIC_API_URL`                    | same as `API_URL`                                                        |
   | `NEXT_PUBLIC_APP_URL`                    | leave empty for now; add your production domain if you have one          |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER`            | your WhatsApp number, digits only e.g. `8801XXXXXXXXX`                   |
   | `NEXT_PUBLIC_CALENDLY_URL`               | your Calendly booking link (optional)                                    |
   | `NEXT_PUBLIC_FIREBASE_API_KEY`           | from the Firebase web app config                                         |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`       | from the Firebase web app config                                         |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID`        | from the Firebase web app config                                         |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`    | from the Firebase web app config                                         |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`| from the Firebase web app config                                        |
   | `NEXT_PUBLIC_FIREBASE_APP_ID`            | from the Firebase web app config                                         |

   In Firebase Console → Authentication → Settings → **Authorized domains**, add your Vercel client
   domain (and any custom domain) — Firebase rejects sign-in from unlisted domains.

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
3. Go to `/register` and create a test account (email/password or Google) — it should land you on `/dashboard`.
4. Go to `/login` and sign in with `skmehedihasan.jr1@gmail.com` (register it via Firebase if you haven't already). You should land on `/admin` and see the KPI dashboard. Click **Clients** — the 20 seeded clients should appear as cards.

---

## Custom domains (later)

- Add your domain to the **client** project in Vercel (Settings → Domains). No change needed to `mehedi-server` unless the server also gets its own subdomain (e.g. `api.mehedihasan.dev`).
- Update `CORS_ORIGINS` on the server to include the new domain.
- Update `NEXT_PUBLIC_APP_URL` on the client to the new domain.
- Add the new domain to Firebase's **Authorized domains** list (Authentication → Settings).

---

## Troubleshooting

**Build fails: "MONGODB_URI is required"**
The server tries to validate env at import time. Make sure `MONGODB_URI` is set in the Vercel project's env vars for **Production**, **Preview**, and **Development** (all three checkboxes).

**Login/register fails with a Firebase error**
- Confirm Email/Password and Google are both enabled in Firebase Console → Authentication → Sign-in method.
- Confirm the client's domain is in Firebase's Authorized domains list.
- Confirm `NEXT_PUBLIC_FIREBASE_*` env vars match the web app config exactly.

**Login succeeds in Firebase but then fails with "Invalid or expired Firebase token" or similar**
The client exchanges the Firebase ID token for a session by calling `API_URL/auth/firebase`. Check:
- `API_URL` in the client project is set to the server's URL (no trailing slash).
- The server is actually deployed and returns `{"ok":true}` at its root URL.
- `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` are set correctly on the server (same Firebase project as the client's config).
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
