# Rasoi Backend (Next.js)

Next.js API and admin dashboard for the **Rasoi** mobile app (`../rasoi_mobile`).

## Features

- **Auth** — phone + name login, guest sessions, JWT tokens
- **Users** — profile, onboarding, pantry, saved recipes, plan/trial state
- **Recipes** — CRUD via admin; public read API for the app
- **Sponsors** — home, pantry, and recipe placements
- **Admin UI** — manage recipes, sponsors, and view users at `/admin`
- **Database** — PostgreSQL via **Supabase** (works on Vercel)

## Quick start

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project
2. Open **Project Settings → Database**
3. Copy two connection strings:
   - **Transaction pooler** (port `6543`) → `DATABASE_URL` (app runtime on Vercel)
   - **Direct connection** (port `5432`) → `DIRECT_URL` (migrations & seed from your machine)

### 2. Configure env

```bash
cp .env.example .env
```

Add to `.env` (or `.env.local` for Next.js):

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — from Supabase **API** settings
- `DATABASE_URL` / `DIRECT_URL` — from Supabase **Database** settings
- `JWT_SECRET` — long random string for Rasoi mobile/admin JWT auth

### 3. Apply Supabase migrations and seed

Apply SQL migrations from `../rasoi_mobile/supabase/migrations/` to your Supabase project (SQL editor or `supabase db push`), then seed reference data:

```bash
npm install
npm run db:seed
npm run dev
```

Use **`npm run dev` only** for local work (Turbopack — fast compile). Do not chain `npm run dev && npm start`; production `npm start` needs `npm run build` first and is slower.

`db:seed` upserts recipes, sponsors, partners, and admin (same IDs → updates, not duplicates).

Admin/API tables live in the **`rasoi` PostgreSQL schema** so they do not conflict with Supabase `public.profiles` → `auth.users`. See `prisma/supabase-note.md`.

Open [http://localhost:3000](http://localhost:3000) for the landing page, or [http://localhost:3000/admin](http://localhost:3000/admin) for the dashboard.

Default admin credentials (from seed):

- Email: `admin@rasoi.app`
- Password: `rasoi-admin123`

Change `ADMIN_PASSWORD` in `.env` before seeding production.

## Deploy to Vercel + Supabase

1. Deploy this repo on Vercel
2. In Vercel **Environment Variables**, set:
   - `DATABASE_URL` — pooled Supabase URI (`6543`, `?pgbouncer=true`)
   - `DIRECT_URL` — direct URI (for local scripts; optional on Vercel)
   - `SUPABASE_SERVICE_ROLE_KEY` — backend admin access to `rasoi` schema
   - `JWT_SECRET` — long random string
3. Apply Supabase migrations and run `npm run db:seed` locally once (against production `DIRECT_URL`)
4. Redeploy if needed

Supabase free tier is enough for early launch (500 MB DB, plenty for thousands of users and hundreds of recipes).

### Keep Supabase awake (avoid free-tier pause)

Free-tier projects pause after ~7 days without activity. This repo includes a daily Vercel cron that pings Postgres + Supabase Auth:

1. Set `CRON_SECRET` in Vercel (long random string)
2. Deploy — `vercel.json` runs `/api/cron/keep-alive` daily at midnight UTC

Manual test locally:

```bash
npm run cron:keep-alive
```

Or call the API (dev allows no secret; production requires the header):

```bash
curl -H "Authorization: Bearer your-cron-secret" https://your-app.vercel.app/api/cron/keep-alive
```

Optional GitHub Actions backup: set repository secrets `KEEP_ALIVE_URL` and `CRON_SECRET` (see `.github/workflows/supabase-keep-alive.yml`).

### Meal push notifications (5× daily)

Personalized breakfast, lunch, snack, dinner, and late-night picks run via **Supabase pg_cron** — **5 daily jobs** (2 hours before each meal anchor, not Vercel — Hobby plan is daily-only).

**Why GitHub Actions was used before:** Vercel Hobby crons are daily-only; GitHub Actions could hit the API every 15 minutes. Supabase `pg_cron` + `pg_net` is a better fit — scheduling lives next to the database and does not depend on the repo.

1. Apply migration `rasoi_mobile/supabase/migrations/20250626120000_meal_notification_cron.sql` (or `supabase db push`).
2. Set `CRON_SECRET` on Vercel.
3. Run **once** in Supabase SQL Editor: `rasoi_backend/scripts/setup-supabase-cron-vault.sql`  
   - `rasoi_api_base_url` → `https://rasoiapplication.in`  
   - `rasoi_cron_secret` → same value as Vercel `CRON_SECRET`
4. Verify in Supabase → **Integrations → Cron** (jobs `rasoi-push-breakfast` … `rasoi-push-late-night`, once daily each).

Optional backup: `.github/workflows/meal-notifications.yml` (manual `workflow_dispatch` only).

Local test:

```bash
npm run cron:meal-notifications -- --forceSlot=dinner --send
```

Manual HTTP test:

```bash
curl -H "Authorization: Bearer your-cron-secret" \
  "https://your-app.vercel.app/api/cron/meal-notifications?forceSlot=breakfast&userId=USER_ID"
```

Meal push times (user timezone, default `Asia/Kolkata`, **2 hr before meal**): **6:00**, **10:30**, **14:00**, **17:30**, **20:00** (±15 min). Meal anchors on Home: 8:00, 12:30, 16:00, 19:30, 21:30+.

## Mobile app integration

Set the API base URL in your Expo app, e.g. `https://your-app.vercel.app/api` (use your machine IP for local dev).

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name":"Dhruv","phone":"9876543210"}'
```

Use the returned `token` as `Authorization: Bearer <token>` on user endpoints.

### Fetch recipes

```bash
curl http://localhost:3000/api/recipes
curl "http://localhost:3000/api/recipes?region=North&dietType=Veg"
```

### Fetch sponsors

```bash
curl "http://localhost:3000/api/sponsors?placement=home"
curl "http://localhost:3000/api/sponsors?placement=pantry"
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run db:setup` | Seed reference data (alias of `db:seed`) |
| `npm run db:seed` | Re-seed recipes, sponsors, partners, admin |
| `npm run db:realtime` | Enable Realtime on `rasoi` schema tables |
| `npm run db:sync-public` | Backfill `public.recipes` from `rasoi.Recipe` |

## Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (Auth client + middleware) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `DATABASE_URL` | Pooled Supabase URI for raw SQL (`pg` pool) |
| `DIRECT_URL` | Direct Supabase URI for local scripts |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for `@/lib/db` |
| `JWT_SECRET` | Signs user and admin JWTs |
| `ADMIN_EMAIL` | Optional seed admin email |
| `ADMIN_PASSWORD` | Optional seed admin password |

See `.env.example` for Supabase URI format.
