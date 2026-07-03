# Developer Guide

## Project Architecture

Rasoi is a monorepo with two deployable applications sharing a Supabase PostgreSQL database:

```
rasoi_mobile  →  Expo React Native client
rasoi_backend →  Next.js 16 API + admin + marketing site
Supabase      →  PostgreSQL (rasoi schema), Auth, Realtime
```

See [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) for diagrams and data flows.

---

## Folder Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).

---

## Coding Standards

Observed conventions in the codebase:

| Area | Convention |
|------|------------|
| Language | TypeScript throughout |
| Mobile paths | `@/` alias to `rasoi_mobile/` root |
| Backend paths | `@/` alias to `rasoi_backend/src/` |
| API responses | `{ ok: true, data }` / `{ ok: false, error }` |
| Validation | Zod schemas in `rasoi_backend/src/lib/validators.ts` |
| DB access | Supabase PostgREST via `@/lib/db` — no Prisma client |
| State | React Context (mobile); Server Components + actions (admin) |
| Auth flows | Frozen — see `.cursor/rules/mobile-auth-navigation-flow.mdc` |
| Migrations | `rasoi_mobile/supabase/migrations/` → apply to remote Supabase |
| Commits | `development` branch for work; `main` for production |

---

## Navigation Architecture

**Mobile:** Expo Router file-based routing.

```
Root Stack
  ├── index (bootstrap)
  ├── (auth) Stack
  ├── (tabs) Tab Navigator
  │     └── settings Stack
  ├── recipe/[id]
  └── paywall
```

See [NAVIGATION_MAP.md](./NAVIGATION_MAP.md).

**Backend:** Next.js App Router — `page.tsx` for UI, `route.ts` for API.

---

## State Management

### Mobile

| Context | Responsibility |
|---------|----------------|
| AppContext | Auth, user, pantry, plan, saved recipes |
| RecipesContext | Paginated catalog |
| TonightRecipesContext | Home meal picks |
| ReferenceContext | Cuisines, pantry sections, paymentsEnabled |
| PartnersContext | Affiliate links |
| ThemeContext | Light/dark |
| AppDialogContext | Global dialogs |

No Redux/Zustand.

### Backend

Server state in PostgreSQL; `unstable_cache` for reference data; Realtime for admin live refresh.

---

## Environment Variables

### Mobile (`rasoi_mobile/.env`)

| Variable | Required | Purpose |
|----------|----------|---------|
| EXPO_PUBLIC_API_URL | Yes | Backend URL |
| EXPO_PUBLIC_SUPABASE_URL | Yes | Supabase project |
| EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Yes | Anon key |
| EXPO_PUBLIC_EAS_PROJECT_ID | Push | Expo push tokens |
| EXPO_PUBLIC_PAYMENT_PROVIDER | Prod | revenuecat/stub/razorpay |
| EXPO_PUBLIC_REVENUECAT_ANDROID_KEY | Prod | RevenueCat SDK |
| EXPO_PUBLIC_SENTRY_DSN | Optional | Error monitoring |
| EXPO_PUBLIC_DIRECT_SUPABASE_READS | Optional | 0 = API only |

Copy from `.env.example`. Use `.env.development.local` for LAN IP override.

### Backend (`rasoi_backend/.env`)

| Variable | Required | Purpose |
|----------|----------|---------|
| NEXT_PUBLIC_SITE_URL | Yes | Canonical URL |
| NEXT_PUBLIC_SUPABASE_URL | Yes | Supabase |
| SUPABASE_SERVICE_ROLE_KEY | Yes | Server DB access |
| JWT_SECRET | Prod | Token signing |
| DATABASE_URL | Yes | Pooled Postgres |
| DIRECT_URL | Migrations | Direct connection |
| CRON_SECRET | Cron | Scheduled jobs |
| REVENUECAT_* | Billing | Subscriptions |

Copy from `.env.example`.

---

## How to Run

### Mobile

```bash
cd rasoi_mobile
npm install
cp .env.example .env
# Edit EXPO_PUBLIC_API_URL for local backend if needed
npm start
npm run android   # device/emulator
```

Against production API:

```bash
npm run start:prod-api
```

### Backend

```bash
cd rasoi_backend
npm install
cp .env.example .env
npm run db:sync    # seed reference data
npm run dev        # http://localhost:3000
```

Admin: http://localhost:3000/admin (seed credentials in backend README).

### API smoke test

```bash
cd rasoi_backend
npm run dev
npx tsx scripts/qa-api-smoke.ts

# Production
QA_API_URL=https://rasoiapplication.in npx tsx scripts/qa-api-smoke.ts
```

---

## How to Build

### Android release APK

```bash
cd rasoi_mobile
export JAVA_HOME="$(/usr/libexec/java_home -v 17)"
npm run android:release-apk
# Output: dist/rasoi-release.apk
```

### Sync APK to backend

```bash
cd rasoi_backend
npm run sync:apk
# Copies to public/rasoi-release.apk
```

### Android AAB (Play Store)

Build via EAS or local Gradle after `expo prebuild`. AAB artifacts in repo root per git status.

### Backend production build

```bash
cd rasoi_backend
npm run build
npm start
```

---

## How to Release

### Branch workflow

1. Develop on `development` branch
2. QA: API smoke + mobile device QA (`npm run qa:device`)
3. If app version changed: build APK, `npm run sync:apk`
4. Commit all changes
5. Merge to `main`, push GitHub
6. Vercel deploys from GitHub push
7. Verify: `curl -sI https://rasoiapplication.in/rasoi-release.apk` → 200, >50MB

### Play Store

1. Bump version in `app.json`, `build.gradle`, `package.json`
2. Build AAB
3. Upload to Play Console
4. Update release notes in `store/play-console/`

### OTA updates (EAS)

```bash
cd rasoi_mobile
npm run ota:production
```

Admin can revert OTA from `/admin/integrations`.

---

## CI/CD

| Component | Mechanism |
|-----------|-----------|
| Backend deploy | Vercel Git integration on push to `main` |
| Vercel cron | `vercel.json` — keep-alive daily |
| Supabase cron | pg_cron — meal notifications 5× daily |
| GitHub Actions | Manual meal-notification backup (per backend exploration) |
| Mobile CI | Device QA scripts locally; EAS for builds |

**Rule:** Never deploy Vercel production ahead of GitHub commit.

---

## Database Workflow

1. Add migration: `rasoi_mobile/supabase/migrations/YYYYMMDDHHMMSS_name.sql`
2. Apply to remote Supabase (SQL editor, `supabase db push`, or MCP)
3. Update `rasoi_backend/prisma/schema.prisma` as reference
4. If Realtime tables changed: `cd rasoi_backend && npm run db:realtime`
5. Seed if needed: `npm run db:seed`

---

## API Development

- Add route: `rasoi_backend/src/app/api/<path>/route.ts`
- Export `GET`/`POST`/etc. handlers
- Use `requireUser()`, `requireAdmin()`, Zod parse, `jsonSuccess`/`jsonError`
- See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## Mobile Development

- Add screen: create file under `rasoi_mobile/app/`
- Register in parent `_layout.tsx` if needed (Expo Router auto-discovers)
- Add service function in `services/`
- Use `authApiFetch` for authenticated calls
- **Do not** change frozen auth flow order without approval

---

## Testing

```bash
# Backend
cd rasoi_backend && npx tsx scripts/qa-api-smoke.ts

# Mobile preflight
cd rasoi_mobile && npm run qa:preflight

# Full device QA (requires connected Android device)
cd rasoi_mobile && npm run qa:device
```

See [QA_TEST_CASES.md](./QA_TEST_CASES.md).

---

## Known Issues & Technical Debt

See [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) and [IMPROVEMENT_REPORT.md](./IMPROVEMENT_REPORT.md).

Highlights:
- No SecureStore for tokens
- AppContext is large
- No distributed rate limiting
- schema.prisma is reference-only

---

## Security Notes

See [SECURITY_REVIEW.md](./SECURITY_REVIEW.md).

- Never commit `.env` files
- `JWT_SECRET` required in production
- `ALLOW_STUB_BILLING` must not be enabled in prod accidentally
- Service role key server-side only

---

## Useful Commands

| Command | Location | Purpose |
|---------|----------|---------|
| `npm run db:seed` | backend | Seed reference data |
| `npm run db:realtime` | backend | Enable Realtime publication |
| `npm run cron:meal-notifications` | backend | Manual push cron |
| `npm run sync:apk` | backend | Copy APK to public |
| `npm run qa:auth` | mobile | Auth flow device QA |
| `npm run setup:push` | mobile | Push notification setup |
| `npm run setup:firebase` | mobile | Firebase setup |

---

## Documentation Maintenance

When shipping features:
1. Update relevant doc in `docs/`
2. Bump version references
3. Regenerate `USER_GUIDE.pdf` if user-facing changes

This documentation set was generated from source code on 2026-07-03.
