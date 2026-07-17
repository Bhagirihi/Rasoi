# Application User Flow Documentation

**Rasoi — Generated from codebase analysis**  
**Date:** July 3, 2026  
**Scope:** `rasoi_mobile/` (Expo) + `rasoi_backend/` (Next.js marketing & admin)

---

## Architecture Overview

Rasoi is a **monorepo** with two user-facing surfaces:

| Surface | Path | Role |
|---------|------|------|
| **Mobile app** | `rasoi_mobile/` | Primary product — Expo Router, 22 routes, email OTP auth via Supabase |
| **Web** | `rasoi_backend/` | Marketing/SEO, APK/Play Store landings, admin console — **no consumer web app** |

All recipe, pantry, and account UX lives in the mobile app. The web backend exposes REST APIs consumed by mobile and an admin console for operators.

### Bootstrap sequence (mobile)

1. **Native splash** — `expo-splash-screen` held via `SplashScreen.preventAutoHideAsync()` in `app/_layout.tsx`
2. **Branded overlay** — `LaunchSplash` + `LaunchSplashGate` dismisses when `fontsLoaded && isHydrated && catalogReady`, min 900 ms, max 1800 ms
3. **Auth hydration** — `AppContext` loads AsyncStorage + Supabase session, calls `fetchCurrentUser()` or `syncSupabaseAccount()`
4. **Routing** — `app/index.tsx` evaluates guards and redirects to the correct destination

### Provider tree (`app/_layout.tsx`)

`ThemeProvider` → `SafeAreaProvider` → `RecipesProvider` → `ReferenceProvider` → `AppProvider` → `TonightRecipesProvider` → `AppDialogProvider` → `PartnersProvider` → Stack + global bridges

### State management

- **No Redux or Zustand** — React Context only
- Primary auth state: `AppContext` via `useAppContext()`
- Session persistence: AsyncStorage (Supabase client) + `@rasoi/*` keys
- **No SecureStore** in the mobile app

### Feature toggles

| Toggle | Effect on navigation |
|--------|---------------------|
| `paymentsEnabled` (server `appConfig`) | Gates paywall, trial welcome, partner billing |
| `showPaywall` (derived in `planLogic.ts`) | Paywall screen auto-closes when false |
| `EXPO_PUBLIC_SCREENSHOT_MODE=1` | Demo data for store screenshots |
| `EXPO_PUBLIC_PAYMENT_PROVIDER` | `stub` / `revenuecat` / `razorpay` |

---

## Screen Inventory

### Mobile — Root & utility

| Screen Name | File Path | Purpose | Entry Conditions | Exit Conditions |
|-------------|-----------|---------|------------------|-----------------|
| Bootstrap Hub | `rasoi_mobile/app/index.tsx` | Cold-start redirect hub | App launch | Always redirects |
| Not Found | `rasoi_mobile/app/+not-found.tsx` | Invalid route handler | Unknown URL | Link to `/` |
| Web HTML Shell | `rasoi_mobile/app/+html.tsx` | Web-only HTML wrapper | Expo web build | N/A |

### Mobile — Auth group `(auth)/`

| Screen Name | File Path | Purpose | Entry Conditions | Exit Conditions |
|-------------|-----------|---------|------------------|-----------------|
| Login | `app/(auth)/login.tsx` | Email OTP login + guest entry | `!isLoggedIn` | OTP verified or guest created |
| Register | `app/(auth)/register.tsx` | Signup: name/phone/email → OTP | Login link; Settings guest upgrade | OTP verified |
| Legal Consent | `app/(auth)/legal-consent.tsx` | Terms & Privacy acceptance | `?from=register` or `?from=guest` only | User accepts |
| Onboarding | `app/(auth)/onboarding.tsx` | Prefs + OS permissions (3 steps) | `!hasCompletedOnboarding` or `?permissionsOnly=1` | Flow complete |
| Trial Welcome | `app/(auth)/trial-welcome.tsx` | Post-onboarding trial upsell | `pendingTrialWelcome === true` | `dismissTrialWelcome()` |

**Onboarding sub-steps (fixed order):** (1) Food preferences, (2) Notifications permission, (3) Location permission

### Mobile — Main tabs `(tabs)/`

| Screen Name | File Path | Purpose | Entry Conditions | Exit Conditions |
|-------------|-----------|---------|------------------|-----------------|
| Home | `app/(tabs)/index.tsx` | Tonight picks, meal rails, announcements | Tab guard passed | User navigates away |
| Recipes | `app/(tabs)/recipes.tsx` | Catalog, search, filters | Tab guard passed | User navigates away |
| Pantry | `app/(tabs)/pantry.tsx` | Pantry staples editor | Tab; forced if `pendingPantrySetup` | Finish/Skip setup |
| Saved | `app/(tabs)/saved.tsx` | Saved recipes list | Tab guard passed | User navigates away |
| Settings | `app/(tabs)/settings/index.tsx` | Profile, plan, logout, prefs | Tab guard passed | Sub-screen or logout |
| Edit Profile | `app/(tabs)/settings/edit-profile.tsx` | Name/phone edit | Settings tap | Save or back |
| Edit Preferences | `app/(tabs)/settings/edit-preferences.tsx` | Diet, cuisines, allergies | Settings tap | Save or back |
| Feedback | `app/(tabs)/settings/feedback.tsx` | In-app feedback form | Settings tap | Submit or back |

### Mobile — Stack screens

| Screen Name | File Path | Purpose | Entry Conditions | Exit Conditions |
|-------------|-----------|---------|------------------|-----------------|
| Recipe Detail | `app/recipe/[id].tsx` | Recipe view; `?cook=1` = cook mode | Cards, notifications, home | `router.back()` |
| Paywall | `app/paywall.tsx` | Rasoi Plus subscription | CTAs push `/paywall` | Back or auto-close if `!showPaywall` |

### Web — Public marketing pages

| Screen Name | File Path | Purpose |
|-------------|-----------|---------|
| India Home | `rasoi_backend/src/app/page.tsx` | Primary landing |
| US/CA/AU Markets | `indian-recipe-app-{usa,canada,australia}/page.tsx` | Regional landings |
| Market aliases | `us/`, `ca/`, `au/` | 308 → regional paths |
| SEO Hub | `indian-recipe-app/page.tsx` | Guides index |
| SEO Guides (10) | `[slug]/page.tsx` | Content pages |
| SEO Recipes (5) | `recipes/[slug]/page.tsx` | Recipe articles |
| Play Store SEO | `play-store/page.tsx` | Indexable Play Store mirror |
| Download | `download/page.tsx` | APK/Play download landing |
| Privacy / Terms / Delete Account | `privacy/`, `terms/`, `delete-account/` | Legal pages |

### Web — Admin console (cookie-JWT protected)

Login: `/admin/login` | Dashboard: `/admin` | Kitchen Styles, Recipes, Announcements, Sponsors, Payments, Promo Codes, Partners, Users, Pantry Defaults, Feedback, Integrations — all under `/admin/*`

---

## Authentication Flow

**Method:** Email OTP only via Supabase Auth — **no password, no forgot-password flow**.

**Login path:** Login → OTP → `resolvePostAuthHref` → (Onboarding if needed) → (permissions-only if OS perms missing) → (Pantry if `pendingPantrySetup`) → (Trial Welcome if pending) → Tabs

**Login must NOT show legal-consent** (register and guest only).

**Session restore:** `AppContext` hydrates session unless `@rasoi/user_logged_out` flag is set.

**Logout:** Settings → `logout()` → `router.replace('/(auth)/login')`

**Inactive account:** `applyUserProfile` auto-logout when `user.isActive === false`.

**Session expired:** API maps unauthorized errors to user message only — **no automatic redirect to Login** (Possible Flow gap).

---

## Registration Flow

Register → OTP → **always** `legal-consent?from=register` → Onboarding → Pantry (new signup sets `pendingPantrySetup`) → optional Trial Welcome → Tabs

**Guest upgrade:** Settings → Sign up → Register (not Login).

---

## Onboarding Flow

Full onboarding: Preferences → Notifications → Location → `completeOnboarding`

Permissions-only: `/(auth)/onboarding?permissionsOnly=1&step=notifications|location`

Exit routing: `!isLoggedIn` → Login | `pendingPantrySetup` → Pantry | `showTrialWelcome` → Trial Welcome | else → Tabs

---

## Dashboard Flow (Home Tab)

Home shows tonight picks, announcements, meal rails. `OfflineBanner` when catalog fetch fails. Navigation to recipe detail, paywall, recipes tab, cook mode (`?cook=1`).

---

## Pantry Flow

`pendingPantrySetup` forces tab guard to Pantry until user finishes or skips setup.

Set for: new signup (`verifyEmailOtpAndLogin` signup flow) and guest first login when `!hasCompletedOnboarding`.

---

## Settings Flow

Profile, preferences, feedback, paywall, notifications toggle, location card (may redirect to permissions-only onboarding), logout, switch account, delete account, guest upgrade to register.

---

## Notification Flow

Deferred until `isHydrated && hasCompletedOnboarding && isLoggedIn && !pendingTrialWelcome`.

| Payload `data.type` | Navigation |
|---------------------|------------|
| `daily_reminder` | `/(tabs)` (home) |
| `admin_message` | `/(tabs)/recipes` |
| `meal_pick` + `recipeId` | `/recipe/{id}` or `?cook=1` if action `cook` |

---

## Deep Link Flow

**Mobile:** `rasoi://` scheme — Expo Router file-based mapping. No custom JS deep-link handler. Guards still apply.

**Web:** `/play-store` (SEO page), `/api/play-store` (302 to Play Store), `/download`, `/api/download/apk`, legacy `/google-play/...` → 301 to `/play-store`.

---

## Error Flows

| Error state | Navigation impact |
|-------------|-------------------|
| API network failure | Stays on screen; user retries |
| Catalog offline | `OfflineBanner`; no route change |
| Invalid route | `+not-found` → `/` |
| Fatal JS error | `AppCrashFallback` with retry |
| Inactive account | Auto logout |
| Session expired message | No auto-redirect |
| Paywall with payments off | Auto `router.back()` |

**Forgot password:** Not implemented.

---

## Navigation Matrix (Mobile)

| Screen | Can Navigate To | Conditions |
|--------|-----------------|------------|
| `index` | Login, Legal Consent, Onboarding, Pantry, Trial Welcome, Tabs | Sequential guards |
| Login | Register, post-auth destinations | `!isLoggedIn` |
| Register | Legal Consent (after OTP) | Always after OTP |
| Legal Consent | Onboarding, Pantry, Trial, Tabs | `from=register\|guest` |
| Onboarding | Login, Pantry, Trial, Tabs | Step completion |
| Trial Welcome | Tabs | `pendingTrialWelcome` |
| Tabs | Each other, Recipe, Paywall, Settings subs | Tab guards |
| Pantry | Tabs after setup | Forced if `pendingPantrySetup` |
| Settings | Sub-screens, Paywall, Register, Login | Guest → Register |
| Recipe `[id]` | Paywall, back | — |
| Paywall | back | `showPaywall === true` |

### Conditional navigation

| Condition | Effect |
|-----------|--------|
| `!isHydrated` | Bootstrap overlay; tabs → `/` |
| `!isLoggedIn` | → Login |
| `!hasCompletedOnboarding` | → Onboarding or Legal Consent |
| OS permissions missing | → permissions-only onboarding |
| `pendingPantrySetup` | → Pantry (blocks other tabs) |
| `pendingTrialWelcome` | → Trial Welcome (after pantry) |
| `showPaywall === false` | Paywall auto-closes |
| Notification tap | Deferred until app ready |

---

## AsyncStorage / Local Persistence

| Key | Purpose |
|-----|---------|
| `@rasoi/auth_token`, `@rasoi/user_id`, `@rasoi/user_logged_out` | Auth session |
| `@rasoi/onboarding_complete` + diet/cuisine keys | Onboarding |
| `@rasoi/pending_trial_welcome`, `@rasoi/pending_pantry_setup` | Post-auth gates |
| `@rasoi/legal_consent` | Terms acceptance |
| `@rasoi/permissions_onboarding_complete` | OS permission prompt |
| `@rasoi/pending_email_verification` | Email verify pending |
| `@rasoi/appearance` | Theme |
| `@rasoi/recommendations_offline_v1` | Cached recommendations |

---

## Dead / Legacy / Unreachable

| Item | Status |
|------|--------|
| `PlayStoreAutoRedirect.tsx` | Deleted (legacy) |
| `app/google-play/.../page.tsx` | Deleted — route.ts 301 redirect |
| `app/play-store/route.ts` | Deleted — replaced by page.tsx |
| `+html.tsx` | Web-only |
| `POST /api/auth/login` (phone) | Returns 410 — disabled |
| Forgot password | Not implemented |
| iOS universal links | Not configured |
| `assetlinks.json` | Not in repo |

---

## Potential Issues

1. **Session expired** — message only; no global 401 → logout redirect
2. **Tab guard vs index** — duplicate guards; `!isHydrated` loops through `/`
3. **Pantry vs trial welcome** — pantry takes priority
4. **Notification nav** — blocked during `pendingTrialWelcome`
5. **`rasoi_market` cookie** — read in middleware, never written
6. **Deep links while logged out** — brief render before guard redirect

---

## User Journey Checklist

| Journey | Implemented | Notes |
|---------|-------------|-------|
| First app launch | Yes | Splash → Login |
| Returning user | Yes | Unless `userLoggedOut` |
| Login | Yes | Email OTP |
| Registration | Yes | OTP → Legal → Onboarding → Pantry |
| Forgot password | No | OTP-only |
| OTP verification | Yes | signup / login / guest_upgrade |
| Logout | Yes | Settings → Login |
| Session expired | Partial | Message only |
| Premium purchase | Yes | Paywall + RevenueCat |
| Pantry creation | Yes | Forced for new signup + new guest |
| Deep link | Partial | `rasoi://`; guards apply |
| Notification open | Yes | Deferred until ready |
| Offline mode | Partial | Banner + cached data |
| Guest → upgrade | Yes | Settings → Register |
| Delete account | Yes | Settings → Login |
| Admin web login | Yes | Cookie JWT |

---

## Key source files

| Concern | File |
|---------|------|
| Cold-start routing | `rasoi_mobile/app/index.tsx` |
| Post-auth routing | `rasoi_mobile/utils/authNavigation.ts` |
| Tab guards | `rasoi_mobile/app/(tabs)/_layout.tsx` |
| Auth state | `rasoi_mobile/context/AppContext.tsx` |
| Notification nav | `rasoi_mobile/hooks/useNotificationNavigation.ts` |
| Permissions logic | `rasoi_mobile/utils/permissionsOnboarding.ts` |
| Web middleware | `rasoi_backend/src/middleware.ts` |
| Download paths | `rasoi_backend/src/lib/app-download.ts` |

---

## Mermaid Flowcharts (reference)

The following flows are implemented in code. Diagrams use Mermaid syntax for tooling; PDF renders them as reference lists.

### Cold start routing (`app/index.tsx`)

1. Launch → Splash (900–1800 ms) → Hydrate AppContext
2. IF `!legalReady || !isHydrated || guest bootstrapping || permissions check` → Bootstrap overlay
3. IF `!isLoggedIn` → Login
4. IF `!hasCompletedOnboarding` → Legal Consent (guest) OR Onboarding
5. IF permissions redirect needed → `onboarding?permissionsOnly=1`
6. IF `pendingPantrySetup` → Pantry
7. IF `pendingTrialWelcome` → Trial Welcome
8. ELSE → Tabs (Dashboard)

### Authentication (login)

Launch → Splash → Hydrate → IF not logged in → Login → Enter Email → Send OTP → Enter OTP → Verify → Sync account → resolvePostAuthHref → (Onboarding | Permissions-only | Pantry | Trial Welcome | Tabs)

### Registration (new account)

Login → Register → Details → OTP → Verify → Set pendingPantrySetup → Legal Consent → Onboarding (Prefs → Notif → Location) → Pantry → (Trial Welcome?) → Tabs

### Guest first-time

Login → Explore as Guest → loginAsGuest → IF no legal consent → Legal Consent → Onboarding → Pantry → Tabs

### Returning user (logged in, onboarding done)

Launch → Hydrate → IF permissions missing → permissionsOnly onboarding → IF pendingPantrySetup → Pantry → IF pendingTrialWelcome → Trial Welcome → ELSE Tabs

### Premium / trial

Free tier user → IF showPaywall → Trial Welcome or Paywall push → Start trial OR Subscribe (RevenueCat) → IF trial expires → TrialExpiredPaywallModal

### Web visitor → app install

Visitor → middleware → IF geo US/CA/AU on `/` → Regional landing → CTA → Google Play OR `/play-store` SEO page OR `/download` → `/api/download/apk` for APK

### Admin login (web)

`/admin/*` → IF no cookie → `/admin/login` → POST credentials → Set `rasoi_admin_token` → Admin Console → Logout clears cookie

### Tab layout guards (`(tabs)/_layout.tsx`)

IF `!isHydrated` → `/` | IF `!hasCompletedOnboarding` → Onboarding | IF `!isLoggedIn` → Login | IF `pendingTrialWelcome && !pendingPantrySetup` → Trial Welcome | IF `pendingPantrySetup && not on pantry` → Pantry | ELSE render tabs

---

## Web — Redirect summary

| From | Status | To |
|------|--------|-----|
| `/us` | 308 | `/indian-recipe-app-usa` |
| `/ca` | 308 | `/indian-recipe-app-canada` |
| `/au` | 308 | `/indian-recipe-app-australia` |
| `/google-play/rasoi-aaj-kya-banaye-indian-recipe-app-android` | 301 | `/play-store` |
| `/api/download/apk` | 302 | EAS APK or `/rasoi-release.apk` |
| `/api/play-store` | 302 | Google Play listing |
| `/admin/*` (no auth) | 307 | `/admin/login` |
| `/admin/login` (authed) | 307 | `/admin` |

---

## Admin console screens (web)

| URL | File |
|-----|------|
| `/admin/login` | `src/app/admin/login/page.tsx` |
| `/admin` | `src/app/admin/(console)/page.tsx` |
| `/admin/kitchen-styles` | `kitchen-styles/page.tsx` |
| `/admin/recipes` | `recipes/page.tsx` |
| `/admin/announcements` | `announcements/page.tsx` |
| `/admin/sponsors` | `sponsors/page.tsx` |
| `/admin/sponsor-analytics` | `sponsor-analytics/page.tsx` |
| `/admin/sponsor-applications` | `sponsor-applications/page.tsx` |
| `/admin/payments` | `payments/page.tsx` |
| `/admin/promo-codes` | `promo-codes/page.tsx` |
| `/admin/partners` | `partners/page.tsx` |
| `/admin/affiliate-events` | `affiliate-events/page.tsx` |
| `/admin/users` | `users/page.tsx` |
| `/admin/pantry-defaults` | `pantry-defaults/page.tsx` |
| `/admin/feedback` | `feedback/page.tsx` |
| `/admin/integrations` | `integrations/page.tsx` |

---

## Context providers (mobile)

| Context | File | Responsibility |
|---------|------|----------------|
| AppContext | `context/AppContext.tsx` | Auth, profile, onboarding, plan, pantry, saved |
| ThemeContext | `context/ThemeContext.tsx` | Light/dark appearance |
| RecipesContext | `context/RecipesContext.tsx` | Recipe catalog |
| ReferenceContext | `context/ReferenceContext.tsx` | Kitchen styles, `paymentsEnabled` |
| TonightRecipesContext | `context/TonightRecipesContext.tsx` | Home recommendations |
| AppDialogContext | `context/AppDialogContext.tsx` | Global dialogs |
| PartnersContext | `context/PartnersContext.tsx` | Partner checkout, quota |

---

## Global bridges (mobile root layout)

| Bridge | Purpose |
|--------|---------|
| AnalyticsScreenBridge | Screen analytics |
| NotificationNavigationBridge | Push notification → route |
| LocationSyncBridge | GPS sync when city missing |
| RevenueCatBridge | Subscription SDK |
| EmailVerificationBridge | Pending email verify modal |
| TrialEndingSoonModal | Trial expiry nudge |
| TrialExpiredPaywallModal | Post-trial paywall |
| AppDialogHost | Global alert host |

---

## Inconsistencies & recommendations

### Inconsistencies

- Session expired shows message but does not auto-navigate to Login
- Tab guard and index both enforce similar guards (circular `/` during hydration)
- `pendingPantrySetup` blocks trial welcome until pantry cleared
- Register always routes through legal-consent even when onboarding incomplete
- Notification navigation blocked while `pendingTrialWelcome`
- `rasoi_market` cookie read but never written in backend
- Deep links may briefly render before auth guards redirect

### Recommendations (analysis only)

1. Add global 401 handler → logout + redirect to Login
2. Add `assetlinks.json` for verified Android App Links
3. Set or remove `rasoi_market` cookie logic in middleware
4. Document notification behavior during trial welcome
5. Keep `/api/play-store` vs `/play-store` distinction documented for marketing

---

## SEO content slugs (web)

**Guides (10):** `what-to-cook-tonight-indian`, `jain-recipes-indian-home-cooking`, `gujarati-dinner-ideas`, `south-indian-weeknight-recipes`, `indian-cooking-in-usa`, `indian-cooking-in-canada`, `indian-cooking-in-australia`, `punjabi-dinner-ideas`, `veg-indian-weeknight-recipes`, `aaj-kya-banaye`

**Recipes (5):** `paneer-butter-masala`, `dal-tadka`, `masala-dosa`, `chicken-biryani`, `palak-paneer`

---

*Document generated from codebase analysis. All flows traced to implementation — no invented flows.*
