# Business Rules

Extracted from `rasoi_backend/src/lib/validators.ts`, `rasoi_mobile/constants/plans.ts`, `planLogic.ts`, RLS migrations, and related code.

---

## Authentication & Identity

| Rule | Source |
|------|--------|
| Auth is email OTP via Supabase; no password login | `auth/login` returns 410; mobile uses OTP |
| Indian phone: 10 digits, starts 6–9, no dummy numbers | `validators.ts` `indianPhone` |
| Disposable email addresses rejected | `identity-validation.ts` |
| Email max 120 chars, lowercased | `allowedEmail` schema |
| Name: 2–80 characters trimmed | `supabaseSyncSchema`, `profileUpdateSchema` |
| Guest users: `isGuest=true`, anonymous Supabase auth | `POST /api/auth/guest` |
| Guest upgrade links via `linkGuestUserId` on supabase-sync | `supabaseSyncSchema` |
| Login flow must NOT show legal consent | `mobile-auth-navigation-flow.mdc` |
| Register/guest must accept legal consent before onboarding | `legal-consent.tsx` |
| Cold start: no auto-guest; user lands on Login | `app/index.tsx` |

---

## Onboarding

| Rule | Source |
|------|--------|
| Fixed step order: food prefs → notifications → location | Frozen auth rule |
| `permissionsOnly=1` skips food prefs for returning users | `onboarding.tsx` query param |
| Onboarding completion sets `hasCompletedOnboarding=true` | `POST /api/users/me/onboarding` |
| New signup sets `pendingPantrySetup` → forced Pantry tab | `AppContext.tsx` |
| Guest onboarding must NOT auto-complete with default prefs | Frozen auth rule |

---

## Pantry

| Rule | Source |
|------|--------|
| Maximum 200 pantry ingredients per user | `pantryUpdateSchema` |
| Default pantry from `AppSettings.defaultPantryIngredients` for new users | DB seed + admin |
| Pantry stored as JSON string array on User row | `rasoi.User.pantryIngredients` |
| Pantry match % computed client-side | Recipe pantry UX rules |
| **Multi-member pantry / invite:** Not implemented | No shared pantry tables |

---

## Saved Recipes

| Rule | Source |
|------|--------|
| Maximum 500 saved recipe IDs | `savedRecipesSchema` |

---

## Recipes & Search

| Rule | Source |
|------|--------|
| Diet types: Veg, Egg, Non-Veg | Recipe schema |
| Diet choice includes Jain | User onboarding |
| Difficulty: Easy, Medium, Hard | Recipe schema |
| Tags: under20, leftover, kids, quick, festive | Recipe schema |
| Unpublished recipes hidden from public API | Recipe route |
| Search query min 2 characters | `/api/recipes/search` |
| Recipe search analytics logged | `POST /api/recipe-searches` |
| Prep time: 1–600 minutes | `recipeCreateSchema` |
| Calories: 1–5000 | `recipeCreateSchema` |

---

## Plans & Subscriptions (Rasoi Plus)

| Rule | Value | Source |
|------|-------|--------|
| Trial duration | 3 days (+ `trialBonusDays`) | `TRIAL_DURATION_DAYS` |
| Trial can start once per user (`hasUsedTrial`) | | `planLogic.ts` |
| Monthly price | ₹49/month | `constants/plans.ts` |
| Yearly price | ₹499/year | `constants/plans.ts` |
| Products | `rasoi_plus_monthly`, `rasoi_plus_yearly` | RevenueCat config |
| Client cannot set `planTier=paid` via API | | `PUT /api/users/me/plan` |
| Paid tier set via billing confirm or RC webhook only | | billing routes |
| `paymentsEnabled` must be true for purchases/trial RPC | | `AppSettings` |
| Free plan: ads shown, partners limited | | `PLAN_FEATURES.free` |
| Trial: ads shown, partners unlocked (trial mode) | | `PLAN_FEATURES.trial` |
| Paid: no ads, full partners | | `PLAN_FEATURES.paid` |
| Free partner shops after trial | 2 per calendar month | `FREE_PARTNER_SHOPS_PER_MONTH` |
| Yearly promo tag | `promo-yearly-5` (5% off) | `YEARLY_PROMO_OFFER_TAG` |

---

## Promo Codes

| Rule | Source |
|------|--------|
| Kinds: `trial_extend`, `yearly_discount` | `PromoCode` CHECK constraint |
| Code normalized: uppercase, trimmed | `normalizePromoCodeInput` |
| One redemption per user per code | Unique `(userId, promoCodeId)` |
| Rate limit: 12 redemptions/min | promo route |

---

## Permissions & Features by Plan

| Feature | Free | Trial | Paid |
|---------|------|-------|------|
| Recipe browse | Yes | Yes | Yes |
| Meal recommendations | Yes | Yes | Yes |
| Ads | Yes | Yes | No |
| Blinkit/Zepto/Instamart checkout | 2/month after trial | Yes | Yes |
| Zomato/Swiggy delivery links | 2/month after trial | Yes | Yes |
| Paywall shown | If paymentsEnabled | If paymentsEnabled | N/A |

---

## Notifications

| Rule | Source |
|------|--------|
| 5 local daily meal reminders (client) | `utils/notifications.ts` |
| Remote push via cron, deduped per user/slot/day | `MealNotificationLog` unique |
| Push token requires notification permission + EAS project ID | mobile notifications util |
| Android Expo Go: remote push unavailable | `notificationCapability.ts` |

---

## Location

| Rule | Source |
|------|--------|
| City max 80 chars | `userLocationSchema` |
| Lat -90 to 90, Lng -180 to 180 | `userLocationSchema` |
| Location used for recommendations and sponsor analytics | recommendations, sponsor events |

---

## Kitchen Preferences

| Rule | Source |
|------|--------|
| Allergy exclusions: max 20 items, 80 chars each | `kitchenPreferencesSchema` |
| Household size: 1–12 | `kitchenPreferencesSchema` |
| Free partner shop counter in kitchenPreferences JSON | `freePartnerShopsUsed`, `freePartnerShopsMonthKey` |

---

## Account Deletion

| Rule | Source |
|------|--------|
| Reason required | `deleteAccountSchema` |
| Registered users must confirm email | delete route |
| Guests skip email confirmation | delete route |

---

## Admin

| Rule | Source |
|------|--------|
| Admin auth via email/password → JWT cookie | admin login |
| Admin API routes use Bearer JWT | `requireAdmin()` |
| User list capped at 200 | `/api/users` GET |

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| `/api/auth/guest` | 20/min/IP |
| `/api/auth/supabase-sync` | 30/min |
| `/api/users/me/promo/redeem` | 12/min |

---

## Affiliate Partners

| Rule | Source |
|------|--------|
| Valid partners: blinkit, zepto, instamart, zomato, swiggy | `affiliateEventSchema` |
| Partners scoped by region (default IN) | `PartnerLink.region` |
| Partner links from API only (no hardcoded IDs in UI) | workspace freeze rules |

---

## Feature Flags

| Toggle | Effect |
|--------|--------|
| `EXPO_PUBLIC_DIRECT_SUPABASE_READS=0` | Route reads through API |
| `EXPO_PUBLIC_PAYMENT_PROVIDER=stub` | Stub billing (preview) |
| `EXPO_PUBLIC_SCREENSHOT_MODE` | Demo data for screenshots |
| Server `paymentsEnabled=false` | Disables paywall purchases |

**Remote feature flag service:** Not implemented

---

## Guest Restrictions

| Rule | Source |
|------|--------|
| Guest upgrade CTA routes to Register (not Login) | Settings |
| Guest may use Login for returning registered accounts | Frozen rule |
| Guest account deletion without email confirm | delete route |

---

## Invite User / Shared Pantry

**Not implemented**

---

## Forgot Password

**Not implemented** — OTP-only auth
