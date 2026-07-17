# Project Structure

## Monorepo Root

```
Rasoi/
├── rasoi_mobile/          # Expo React Native app (primary client)
├── rasoi_backend/         # Next.js API, admin, marketing site
├── docs/                  # Project documentation (this set)
├── .cursor/               # Cursor rules, skills, MCP server configs
├── .vercel/               # Vercel deployment metadata
└── README.md              # Top-level quick start
```

---

## Mobile App (`rasoi_mobile/`)

```
rasoi_mobile/
├── app/                   # Expo Router screens (file-based routing)
│   ├── _layout.tsx        # Root Stack, providers, bridges
│   ├── index.tsx          # Bootstrap redirect logic
│   ├── (auth)/            # Auth stack (login, register, onboarding, etc.)
│   ├── (tabs)/            # Main tab navigator
│   ├── recipe/[id].tsx    # Recipe detail (stack overlay)
│   └── paywall.tsx        # Rasoi Plus paywall
├── components/            # UI components (~89 files)
│   ├── auth/
│   ├── paywall/
│   ├── settings/
│   └── ui/
├── context/               # React Context providers (7)
├── services/              # API & Supabase service layer (20)
│   └── payments/          # RevenueCat, stub, types
├── hooks/                 # Custom hooks (17)
├── utils/                 # Helpers (auth, storage, API, notifications, etc.)
├── constants/             # Plans, theme, payments, testIds
├── data/                  # Offline starter recipes
├── supabase/
│   ├── migrations/        # SQL migrations (source of truth)
│   └── functions/         # Edge functions (auth sync/guest)
├── android/               # Native Android project (prebuild)
├── scripts/               # Build, QA, Firebase setup scripts
├── store/play-console/    # Play Store assets, release notes
├── app.config.ts          # Expo dynamic config
├── app.json               # Static Expo manifest
├── eas.json               # EAS Build/Update config
└── package.json           # v1.0.10
```

### Key mobile config files

| File | Purpose |
|------|---------|
| `app.config.ts` | EAS project ID, AdMob, Firebase plugins, updates URL |
| `app.json` | Scheme `rasoi`, permissions, icons, Android package `com.bhagihiri.rasoiapp` |
| `.env.example` | Supabase, API URL, RevenueCat, Sentry keys |
| `.env.development` | LAN API URL for local backend |
| `.env.production` | Production API URL |
| `babel.config.js` | Expo Babel preset |
| `tsconfig.json` | Path alias `@/` → project root |

---

## Backend (`rasoi_backend/`)

```
rasoi_backend/
├── src/
│   ├── app/
│   │   ├── api/           # REST API route handlers
│   │   ├── admin/         # Admin console (server components + actions)
│   │   ├── download/      # APK download landing page
│   │   ├── play-store/    # Play Store SEO landing
│   │   ├── google-play/   # Legacy redirect → /play-store
│   │   ├── privacy/       # Legal pages
│   │   ├── terms/
│   │   ├── delete-account/
│   │   ├── [slug]/        # SEO content pages
│   │   ├── recipes/[slug]/# SEO recipe articles
│   │   ├── indian-recipe-app*/
│   │   ├── layout.tsx
│   │   ├── page.tsx       # India market landing
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── lib/               # Business logic (~60 modules)
│   └── middleware.ts      # CORS, geo redirect, session
├── prisma/
│   ├── schema.prisma      # Reference schema (no runtime client)
│   └── *.sql              # Supplemental SQL helpers
├── scripts/               # Seed, cron, QA smoke, sync
├── public/
│   └── rasoi-release.apk  # Sideload APK (synced from mobile build)
├── vercel.json            # Cron: keep-alive daily
└── package.json           # Next.js 16.2.9
```

### Key backend config files

| File | Purpose |
|------|---------|
| `.env.example` | Supabase, JWT, cron, RevenueCat, admin seed |
| `vercel.json` | Vercel cron schedule |
| `next.config.ts` | Next.js configuration |
| `tsconfig.json` | `@/` path alias |

---

## Documentation & Tooling (`.cursor/`)

| Path | Purpose |
|------|---------|
| `.cursor/rules/` | Workspace rules (Supabase sync, deploy, auth flows) |
| `.cursor/skills/expo-mobile-qa/` | Device QA skill |
| `.cursor/mcp-servers/` | MCP integrations (Google Play, Vercel, Supabase, etc.) |

---

## Routing Summary

### Mobile (Expo Router)

| Pattern | Type |
|---------|------|
| `app/index.tsx` | Redirect hub |
| `app/(auth)/*` | Stack (gesture disabled) |
| `app/(tabs)/*` | Bottom tabs |
| `app/(tabs)/settings/*` | Nested stack in Settings tab |
| `app/recipe/[id]` | Stack card |
| `app/paywall` | Stack card |

### Backend (Next.js App Router)

| Pattern | Type |
|---------|------|
| `src/app/api/**/route.ts` | API Route Handlers |
| `src/app/admin/**` | Server pages + server actions |
| `src/app/**/page.tsx` | Marketing/SEO pages |
| `src/app/**/route.ts` | Redirect routes (play-store, google-play) |

---

## Dependencies (high level)

### Mobile runtime

- Expo SDK ~54, React Native 0.81, React 19
- `@supabase/supabase-js`, `expo-router`, `expo-notifications`, `expo-location`
- `react-native-purchases` (RevenueCat), `react-native-google-mobile-ads`
- `@sentry/react-native`, `@react-native-firebase/*`

### Backend runtime

- Next.js 16, React 19, Zod 4
- `@supabase/supabase-js`, `@supabase/ssr`, `jose`, `bcryptjs`, `pg`
- `expo-server-sdk` (push notifications)

---

## Environment Variables (cross-project)

See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for full lists. Critical shared vars:

| Variable | Mobile | Backend |
|----------|--------|---------|
| Supabase URL | `EXPO_PUBLIC_SUPABASE_URL` | `NEXT_PUBLIC_SUPABASE_URL` |
| Supabase key | `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| API URL | `EXPO_PUBLIC_API_URL` | `NEXT_PUBLIC_SITE_URL` |
| Service role | — | `SUPABASE_SERVICE_ROLE_KEY` |
| JWT | — | `JWT_SECRET` |
