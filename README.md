# Rasoi

Indian home-cooking companion — discover recipes from your pantry, plan tonight's meal, and shop missing ingredients.

| | |
|---|---|
| **Android app** | Expo / React Native (`rasoi_mobile/`) |
| **API & admin** | Next.js on Vercel (`rasoi_backend/`) |
| **Database** | Supabase (PostgreSQL, Auth, Realtime) |

## Download Android APK

Install the latest release on your phone (enable **Install unknown apps** for your browser or file manager):

**[Download rasoi-release.apk](https://github.com/Bhagirihi/Rasoi/releases/latest/download/rasoi-release.apk)**

| | |
|---|---|
| Package | `com.rasoi.app` |
| Version | 1.0.0 (versionCode 1) |

> Release builds are currently signed with a debug keystore for sideloading and testing. Use a production keystore before Play Store submission.

## What's in the app

- **Home** — personalized greeting, tonight's picks, hero recipe
- **Recipe** — search, quick filters, pantry mode, 4,000+ dishes
- **Pantry** — mark what you have; match recipes you can cook now
- **Saved** — bookmark favourites and shop missing items
- **Settings** — diet, region, theme, Rasoi Plus trial

Backend features: auth, recipes, sponsors, affiliate partners, meal notifications, admin dashboard.

## Repository layout

```
Rasoi/
├── rasoi_mobile/     # Expo app (Android / iOS)
├── rasoi_backend/    # Next.js API + /admin
└── README.md         # this file
```

## Quick start — mobile

```bash
cd rasoi_mobile
npm install
cp .env.example .env   # set EXPO_PUBLIC_API_URL, Supabase keys
npm start              # Expo dev server
npm run android        # run on device/emulator
```

### Build release APK locally

Requires JDK 17+ and Android SDK:

```bash
cd rasoi_mobile
export JAVA_HOME="$(/usr/libexec/java_home -v 17 2>/dev/null || echo /usr/local/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home)"
npm run android:release-apk
# Output: dist/rasoi-release.apk
```

## Quick start — backend

See [`rasoi_backend/README.md`](rasoi_backend/README.md) for Supabase setup, seeding, Vercel deploy, and API docs.

```bash
cd rasoi_backend
npm install
cp .env.example .env
npm run db:sync
npm run dev
```

Admin: [http://localhost:3000/admin](http://localhost:3000/admin) (default seed credentials in backend README).

## Environment (mobile)

| Variable | Purpose |
|----------|---------|
| `EXPO_PUBLIC_API_URL` | Rasoi backend base URL (e.g. `https://your-app.vercel.app/api`) |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key |
| `EXPO_PUBLIC_SENTRY_DSN` | Sentry DSN for crash reporting (production builds) |

## Device QA

```bash
cd rasoi_mobile
npm run qa:preflight   # adb + Maestro checks
npm run qa:smoke       # smoke flows on connected device
```

Maestro flows live in `rasoi_mobile/e2e/maestro/`.

## Notifications

Users with notifications enabled receive:

| Type | When | Source |
|------|------|--------|
| Meal picks (×5) | 8:00, 12:30, 16:00, 19:00, 22:00 (user timezone) | GitHub Actions → backend → Expo Push |
| Daily nudges | 5:00 PM & 10:00 PM | Local on device |

Configure GitHub secrets `CRON_SECRET` and `MEAL_NOTIFICATIONS_URL` — see [`rasoi_backend/README.md`](rasoi_backend/README.md#meal-push-notifications-5-daily).

## Error monitoring (Sentry)

Rasoi reports crashes and API failures to [Sentry](https://sentry.io) when DSN env vars are set.

| App | Env var | Sentry project |
|-----|---------|----------------|
| Mobile | `EXPO_PUBLIC_SENTRY_DSN` | `rasoi-mobile` |
| Backend | `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` | `rasoi-api` |

Mobile captures: unhandled errors, API failures, user context after login.  
Backend captures: unhandled API errors via `handleApiError`.

See `.env.example` in each package. Set `SENTRY_ORG`, `SENTRY_PROJECT`, and `SENTRY_AUTH_TOKEN` on Vercel for source maps.

## Marketing

30 ready-to-post captions for LinkedIn, Instagram, and X: [`docs/marketing/social-posts-30.md`](docs/marketing/social-posts-30.md)

## Releases

APKs are published on [GitHub Releases](https://github.com/Bhagirihi/Rasoi/releases). To publish a new build:

```bash
cd rasoi_mobile && npm run android:release-apk
gh release create v1.0.0 dist/rasoi-release.apk --title "Rasoi 1.0.0" --notes "Release notes…"
```

## License

Private project — all rights reserved.
