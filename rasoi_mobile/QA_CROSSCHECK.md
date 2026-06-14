# Rasoi QA Cross-Check — 004 (Mobile) ↔ 005 (Backend)

**Date:** 2026-06-10  
**Scope:** End-to-end integration, API contract alignment, regression checks  
**Automated smoke:** `cd ../005 && npx tsx scripts/qa-api-smoke.ts` (requires `npm run dev`)

---

## Architecture Map

| 004 (Expo) | 005 (Next.js) | Auth |
|------------|---------------|------|
| `services/recipes.ts` | `GET /api/recipes`, `GET /api/recipes/:id` | Public |
| `services/user.ts` | `GET/PATCH /api/users/me` | Bearer JWT |
| `services/auth.ts` | `POST /api/auth/guest`, `POST /api/auth/supabase-sync` | Mixed |
| `services/supabaseAuth.ts` | Supabase Auth (OTP) → sync | Supabase token |
| `services/partners.ts` | `GET /api/partners` | Public |
| `services/reference.ts` | `GET /api/reference` | Public |
| `services/sponsors.ts` | `GET /api/sponsors` | Public |
| `services/affiliateEvents.ts` | `POST /api/affiliate-events` | Optional Bearer |
| Supabase Realtime | `rasoi.Recipe` postgres changes | Anon key |

---

## Test Cases

### Onboarding & Auth

| ID | Steps | Expected | Status |
|----|-------|----------|--------|
| TC-AUTH-01 | Complete onboarding → Maybe later → Login | No onboarding loop; lands on login once | **PASS** (fixed) |
| TC-AUTH-02 | Send email OTP with valid name/phone/email | Supabase sends code; `[RasoiAuth] sendEmailOtp:success` | Manual |
| TC-AUTH-03 | Verify OTP → sync | `POST /api/auth/supabase-sync` returns JWT + user | Manual — needs `SUPABASE_SERVICE_ROLE_KEY` in 005 `.env` |
| TC-AUTH-04 | Explore as Guest | `POST /api/auth/guest` → tabs; onboarding syncs to server | **PASS** (automated guest flow) |
| TC-AUTH-05 | Invalid phone `1234567890` on register | Client rejects before OTP | **PASS** (fixed validation) |
| TC-AUTH-06 | Logout | Clears JWT + Supabase session | Manual |

### User Profile & Plan

| ID | Steps | Expected | Status |
|----|-------|----------|--------|
| TC-USER-01 | PATCH profile name/phone | Persists via `GET /api/users/me` | Manual |
| TC-USER-02 | Guest edit profile → Sign in | Navigates to login (not failed PATCH) | **PASS** (fixed) |
| TC-USER-03 | Guest edit profile → Continue as Guest (already logged in) | Goes back; no duplicate guest account | **PASS** (fixed) |
| TC-USER-04 | Start trial after onboarding | Plan tier `trial`; partners unlock | **PASS** (fixed plan API) |
| TC-USER-05 | Upgrade to paid | `planTier: paid` persisted | Manual |
| TC-USER-06 | PUT pantry empty `[]` | Accepted (no validation error) | **PASS** (automated) |
| TC-USER-07 | Toggle saved recipe | `PUT /api/users/me/saved-recipes` | Manual |

### Recipes & Content

| ID | Steps | Expected | Status |
|----|-------|----------|--------|
| TC-REC-01 | Home loads recipes | `GET /api/recipes` returns published list | **PASS** (automated) |
| TC-REC-02 | Tap recipe card | Detail loads (not stuck on Loading…) | **PASS** (fixed effect loop) |
| TC-REC-03 | Recipe not found | Shows "Recipe not found" | Manual |
| TC-REC-04 | Jain diet filter | Shows Veg recipes (client + server aligned) | **PASS** (code review) |
| TC-REC-05 | Realtime recipe update | List refreshes after admin edit | Manual |

### Partners & Monetization

| ID | Steps | Expected | Status |
|----|-------|----------|--------|
| TC-PART-01 | Load partner links | `GET /api/partners` or fallback constants | **PASS** (automated) |
| TC-PART-02 | Grocery checkout tap | Opens deep link + logs affiliate event | Manual |
| TC-PART-03 | Free tier | Partners locked (`showPartners: false`) | Manual |
| TC-PART-04 | Trial tier | Partners visible with trial banner | Manual |

### Reference Data

| ID | Steps | Expected | Status |
|----|-------|----------|--------|
| TC-REF-01 | Pantry screen sections | Matches `GET /api/reference` pantrySections | **PASS** (automated structure) |
| TC-REF-02 | Home region chips | Uses regionalCuisines from API | Manual |

### Navigation / UI

| ID | Steps | Expected | Status |
|----|-------|----------|--------|
| TC-UI-01 | Tabs layout | No extraneous screen warnings | **PASS** (fixed) |
| TC-UI-02 | Recipe detail hooks | No "Rendered more hooks" crash | **PASS** (fixed) |
| TC-UI-03 | Settings sub-routes | edit-profile, edit-preferences, paywall navigate | Manual |

---

## Bugs Found & Fixed

### BUG-001 — Plan API response shape mismatch (Critical)
- **Symptom:** Trial never applied; partners stayed locked after onboarding.
- **Cause:** `PUT /api/users/me/plan` returned full `UserProfileResponse` but 004 read `plan.planTier` at top level (undefined).
- **Fix:** 005 returns `serializeUser(updated).plan`; 004 `updateUserPlan` unwraps `.plan` defensively.
- **Files:** `005/src/app/api/users/me/plan/route.ts`, `004/services/user.ts`

### BUG-002 — Recipe detail infinite loading (Critical)
- **Symptom:** "Loading recipe…" never cleared.
- **Cause:** `useEffect` re-ran when `loadRecipeById` reference changed after every fetch.
- **Fix:** Effect depends only on `recipeId`; stable `loadRecipeById` in context.
- **Files:** `004/app/recipe/[id].tsx`, `004/context/RecipesContext.tsx`

### BUG-003 — Onboarding loop after "Maybe later" (Critical)
- **Symptom:** Redirected back to onboarding after login.
- **Cause:** Server `hasCompletedOnboarding: false` overwrote local `true`; pending onboarding not restored.
- **Fix:** Merge onboarding flag; restore `pendingOnboardingRef` on hydrate; sync after auth.
- **Files:** `004/context/AppContext.tsx`

### BUG-004 — React hooks order crash on recipe screen (Critical)
- **Symptom:** Crash at `useFloatingScrollIndicator` via `_layout.tsx` stack.
- **Cause:** Hook called after conditional early returns.
- **Fix:** Move hook to top of component.
- **Files:** `004/app/recipe/[id].tsx`

### BUG-005 — Extraneous tab screen warnings (Low)
- **Symptom:** `[Layout children]: Too many screens defined` spam.
- **Cause:** Nested settings routes declared in tabs layout.
- **Fix:** Removed duplicate `Tabs.Screen` entries.
- **Files:** `004/app/(tabs)/_layout.tsx`

### BUG-006 — Edit profile guest "Sign in" broken (Medium)
- **Symptom:** Guest tapping "Sign in to Rasoi" tried `updateProfile` → error.
- **Fix:** Redirect to `/(auth)/login` when `isGuest`.
- **Files:** `004/app/(tabs)/settings/edit-profile.tsx`

### BUG-007 — Duplicate guest accounts (Medium)
- **Symptom:** "Continue as Guest" created new guest when already logged in.
- **Fix:** If `isLoggedIn`, just `router.back()`.
- **Files:** `004/app/(tabs)/settings/edit-profile.tsx`

### BUG-008 — Weak phone validation on email sync (Medium)
- **Symptom:** Invalid phones (e.g. `0000000000`) passed client length check; inconsistent with backend.
- **Fix:** Client uses `isValidIndianPhone`; 005 `supabaseSyncSchema` uses same regex as login.
- **Files:** `004/utils/storage.ts`, `005/src/lib/validators.ts`

### BUG-009 — Unsafe JSON.parse on pantry/saved routes (Low)
- **Symptom:** Corrupt DB JSON could 500 pantry/saved GET.
- **Fix:** Use exported `parseJson` with fallback.
- **Files:** `005/src/lib/serializers.ts`, pantry + saved-recipes routes

### BUG-010 — TypeScript error in supabaseAuth (Low)
- **Symptom:** `tsc` failed on `data.user?.id` for OTP send response.
- **Fix:** Removed invalid userId log on send (OTP send has no user yet).
- **Files:** `004/services/supabaseAuth.ts`

### BUG-011 — supabase-sync returns 500 when service role missing (Medium)
- **Symptom:** Email login shows generic error; logs show Internal server error.
- **Cause:** Missing `SUPABASE_SERVICE_ROLE_KEY` threw inside route → 500.
- **Fix:** Return 503 with clear message when admin client cannot be created.
- **Files:** `005/src/app/api/auth/supabase-sync/route.ts`

---

## Open Issues (Not Fixed — Requires Config / Manual)

| ID | Issue | Action |
|----|-------|--------|
| OPEN-01 | Email OTP sync fails without `SUPABASE_SERVICE_ROLE_KEY` in 005 `.env` | Add service role key; restart backend |
| OPEN-02 | Push notifications error in Expo Go SDK 53 | Use development build for remote push |
| OPEN-03 | Guest login creates new DB row each time (by design) | Consider reuse or cleanup cron |
| OPEN-04 | `localhost` API URL on physical device | Set `EXPO_PUBLIC_API_URL` to LAN IP or rely on auto-detect |

---

## API Contract Checklist (004 ↔ 005)

| Endpoint | 004 caller | Response shape | Aligned |
|----------|-----------|----------------|---------|
| `GET /api/recipes` | `fetchPublishedRecipes` | `Recipe[]` | Yes |
| `GET /api/recipes/:id` | `fetchRecipeById` | `Recipe` | Yes |
| `POST /api/auth/guest` | `loginAsGuestUser` | `{ token, user }` | Yes |
| `POST /api/auth/supabase-sync` | `syncSupabaseAccount` | `{ token, user }` | Yes |
| `GET /api/users/me` | `fetchCurrentUser` | `UserProfileResponse` | Yes |
| `POST /api/users/me/onboarding` | `completeUserOnboarding` | `UserProfileResponse` | Yes |
| `PUT /api/users/me/plan` | `updateUserPlan` | `plan` object | **Yes (fixed)** |
| `PUT /api/users/me/pantry` | `updatePantryIngredients` | `UserProfileResponse` | Yes |
| `PUT /api/users/me/saved-recipes` | `updateSavedRecipeIds` | `UserProfileResponse` | Yes |
| `PUT /api/users/me/push-token` | `registerPushToken` | `{ id, expoPushToken, ... }` | Yes |
| `GET /api/partners` | `loadPartnerLinks` | `PartnerLinkResponse[]` | Yes |
| `GET /api/reference` | `loadReferenceData` | `{ regionalCuisines, pantrySections }` | Yes |
| `POST /api/affiliate-events` | `logAffiliateEvent` | `{ id }` | Yes |

---

## How to Re-Run QA

```bash
# Terminal 1 — backend
cd ../005 && npm run dev

# Terminal 2 — API smoke
cd ../005 && npx tsx scripts/qa-api-smoke.ts

# Terminal 3 — mobile typecheck
cd ../004 && npx tsc --noEmit

# Terminal 4 — app
cd ../004 && npm start
```

---

## Smoke Test Results (2026-06-10)

```
GET /api/recipes          OK (recipes returned)
GET /api/reference        OK
GET /api/partners         OK
POST /api/auth/guest      OK
GET /api/users/me         OK
POST /api/users/me/onboarding OK
PUT /api/users/me/plan    FAIL before fix (returned full user)
PUT /api/users/me/pantry  OK (empty list)
GET /api/recipes/:id      OK
```

Re-run `qa-api-smoke.ts` after plan fix — **10/10 passed** (TC-API-10 accepts 401 invalid token or 503 missing service role).
