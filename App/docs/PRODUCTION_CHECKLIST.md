# Rasoi Mobile — Production Checklist

Track release readiness for sideload beta and Play Store launch.  
**Last verified:** 17 Jun 2026

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | `SUPABASE_SERVICE_ROLE_KEY` on Vercel | ✅ Done | Set on Production + Preview (verified via `vercel env ls`) |
| 2 | `CRON_SECRET` + `MEAL_NOTIFICATIONS_URL` on GitHub | ✅ Done | Secrets present; workflow `.github/workflows/meal-notifications.yml` runs every 15 min |
| 3 | `EXPO_PUBLIC_SENTRY_DSN` in build `.env` | ✅ Local | Set in `rasoi_mobile/.env` — **rebuild APK/AAB** after any DSN change |
| 4 | `google-services.json` + FCM v1 on EAS | ✅ Done | FCM v1 linked to `com.bhagihiri.rasoiapp` on @takeyshi/rasoi; `google-services.json` in local build env |
| 5 | `npm run qa:preflight` + `qa:device` | ⚠️ Blocked | No Android device connected for Maestro; API 200 + guest auth 200 verified |
| 6 | Privacy policy live + Settings link | ✅ Code ready | `/privacy` + `/terms` pages + Settings footer — **deploy backend to Vercel** |
| 7 | Monetization decision | ✅ Admin toggle | `/admin/payments` — OFF = no paywall, partners unlocked, ads + sponsors on |
| 8 | Production keystore (Play Store) | ✅ Done | EAS production keystore `def8a336-40b7-46f1-a6f9-a61bcfc89cc1` |
| 9 | `buildType: app-bundle` (Play Store) | ✅ Configured | `eas.json` production profile → `app-bundle`; use `preview` profile for sideload APK |
| 10 | Leave **open testing** live | ⚠️ Console | Pantry-first home + Hindi dish search are in the app. Keep the Play track on **open testing** so the public listing URL works (`play.google.com/store/apps/details?id=com.bhagihiri.rasoiapp`). Production promote can wait. |

---

## Verify commands

```bash
# Production API
curl -s -o /dev/null -w "%{http_code}\n" https://rasoiapplication.in/api/recipes

# Vercel env (backend)
cd rasoi_backend && vercel env ls production

# GitHub secrets
gh secret list

# TypeScript
cd rasoi_mobile && npx tsc --noEmit

# Device QA (phone USB + app installed)
cd rasoi_mobile && npm run qa:preflight && npm run qa:device
```

## EAS / push setup

```bash
cd rasoi_mobile
npx eas login
node scripts/setup-eas-keystore.cjs      # Play Store signing
node scripts/upload-eas-fcm.cjs          # Server meal pushes on EAS builds
npm run setup:push                       # Full push checklist
```

## Sideload vs Play Store

| Channel | Build profile | Output | Signing |
|---------|---------------|--------|---------|
| **Website APK** | `preview` or local `npm run android:release-apk` | `.apk` | Local debug (today) or EAS internal |
| **Play Store** | `production` | `.aab` | EAS production keystore |

## Enable monetization at launch

1. Turn **Payment** toggle **ON** in admin (`/admin/payments`)
2. Create real AdMob app + ad units; replace test IDs in `app.json` and `AdMobBanner.tsx`
3. Wire RevenueCat or Razorpay; set `EXPO_PUBLIC_PAYMENT_PROVIDER` (or leave unset — app auto-selects RevenueCat when SDK keys are present). See `.env.example` and upload keys to EAS production.
4. Rebuild and resubmit to Play Store

## Deploy order (this batch)

1. Push backend → Vercel (privacy/terms pages live)
2. Rebuild mobile APK with current `.env`
3. Upload APK to hosting / `public` if using website download
4. Run device QA smoke on production API
