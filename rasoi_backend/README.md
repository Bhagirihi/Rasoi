# Rasoi Backend (Next.js)

Next.js API and admin dashboard for the **Rasoi** mobile app (`../004`).

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

### 3. Push schema and seed (upserts — safe to re-run, no duplicates)

```bash
npm install
npm run db:sync
npm run dev
```

`db:sync` applies the Prisma schema to Supabase and seeds recipes, sponsors, partners, and admin using **upserts** (same IDs → updates, not duplicates).

Prisma tables live in the **`rasoi` PostgreSQL schema** so they do not conflict with Supabase `public.profiles` → `auth.users` (from optional 004 SQL migration). See `prisma/supabase-note.md`.

Open [http://localhost:3000](http://localhost:3000) for the landing page, or [http://localhost:3000/admin](http://localhost:3000/admin) for the dashboard.

Default admin credentials (from seed):

- Email: `admin@rasoi.app`
- Password: `rasoi-admin123`

Change `ADMIN_PASSWORD` in `.env` before seeding production.

## Deploy to Vercel + Supabase

1. Deploy this repo on Vercel
2. In Vercel **Environment Variables**, set:
   - `DATABASE_URL` — pooled Supabase URI (`6543`, `?pgbouncer=true`)
   - `DIRECT_URL` — direct URI (for local migrations; not required on Vercel if you migrate locally)
   - `JWT_SECRET` — long random string
3. Run `npm run db:push` and `npm run db:seed` locally once (against production `DIRECT_URL`)
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

## Mobile app integration (004)

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
| `npm run db:setup` | Push schema + seed data from 004 |
| `npm run db:seed` | Re-seed recipes and sponsors |
| `npm run db:push` | Apply Prisma schema to Supabase |
| `npm run db:migrate` | Create/run migrations (uses `DIRECT_URL`) |

## Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (Auth client + middleware) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `DATABASE_URL` | Pooled Supabase URI for the Next.js app |
| `DIRECT_URL` | Direct Supabase URI for Prisma CLI |
| `JWT_SECRET` | Signs user and admin JWTs |
| `ADMIN_EMAIL` | Optional seed admin email |
| `ADMIN_PASSWORD` | Optional seed admin password |

See `.env.example` for Supabase URI format.
