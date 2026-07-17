# API Documentation

**Base URL (production):** `https://rasoiapplication.in`  
**Response envelope:** `{ ok: true, data: T }` | `{ ok: false, error: string, details?: unknown }`  
**CORS:** Enabled on `/api/*` via middleware

---

## Authentication

| Method | Header | Used For |
|--------|--------|----------|
| Supabase JWT | `Authorization: Bearer <supabase_access_token>` | Mobile users (primary) |
| Rasoi JWT | `Authorization: Bearer <rasoi_jwt>` | Legacy fallback; admin API |
| Cron secret | `Authorization: Bearer <CRON_SECRET>` | Cron routes |
| Webhook secret | `Authorization: Bearer <REVENUECAT_WEBHOOK_SECRET>` | RevenueCat webhook |
| Admin cookie | `rasoi_admin_token` (HttpOnly) | Admin web UI only |

**User resolution:** Supabase token first → Rasoi JWT with `type: 'user'`.

---

## Auth Endpoints

### POST `/api/auth/login`

| | |
|--|--|
| **Status** | **410 Gone** — legacy phone login disabled |
| **Auth** | None |

### POST `/api/auth/guest`

| | |
|--|--|
| **Auth** | Optional Supabase anonymous Bearer |
| **Rate limit** | 20/min/IP |
| **Request** | `{ acceptedTerms: true, termsVersion?: string, name?: string }` |
| **Response** | `{ token: string, user: UserProfileResponse }` |
| **Errors** | 400 validation, 429 rate limit |

### POST `/api/auth/supabase-sync`

| | |
|--|--|
| **Auth** | Required Supabase Bearer |
| **Rate limit** | 30/min |
| **Request** | `{ name, phone?, acceptedTerms?: true, linkGuestUserId?, onboarding? }` |
| **Response** | `{ token, user }` |
| **Errors** | 401 unauthorized, 409 conflict |

### POST `/api/auth/admin/login`

| | |
|--|--|
| **Auth** | None |
| **Request** | `{ email, password }` |
| **Response** | `{ token, admin: { id, email, name } }` |

---

## User Endpoints

### GET `/api/users/me`

| | |
|--|--|
| **Auth** | User required |
| **Response** | `UserProfileResponse` |
| **Errors** | 401 |

### PATCH `/api/users/me`

| | |
|--|--|
| **Auth** | User required |
| **Request** | Partial: name, phone, dietChoice, dietPreference, regionalCuisine, favoriteCuisines, notificationsEnabled, kitchenPreferences |
| **Response** | Updated `UserProfileResponse` |

### DELETE `/api/users/me`

| | |
|--|--|
| **Auth** | User required |
| **Request** | `{ reason, confirmEmail?, reasonDetail? }` — guests skip email confirm |
| **Response** | `{ deleted: true }` |

### POST `/api/users/me/onboarding`

| | |
|--|--|
| **Request** | `{ dietPreference, dietChoice, regionalCuisine, favoriteCuisines, notificationsEnabled }` |
| **Response** | Updated user with `hasCompletedOnboarding: true` |

### GET/PUT `/api/users/me/pantry`

| | |
|--|--|
| **GET Response** | `{ ingredients: string[] }` |
| **PUT Request** | `{ ingredients: string[] }` max 200 |
| **PUT Response** | Full user profile |

### GET/PUT `/api/users/me/saved-recipes`

| | |
|--|--|
| **GET Response** | `{ recipeIds: string[] }` |
| **PUT Request** | `{ recipeIds: string[] }` max 500 |

### GET/PUT `/api/users/me/plan`

| | |
|--|--|
| **GET Response** | `UserPlanResponse` |
| **PUT Request** | `{ planTier: 'free' \| 'trial' }` — **cannot set paid** |
| **Note** | Paid tier set only via billing confirm/webhook |

### POST `/api/users/me/promo/redeem`

| | |
|--|--|
| **Rate limit** | 12/min |
| **Request** | `{ code: string }` 4–32 chars |
| **Response** | Redeem result + updated plan |
| **Errors** | 400 invalid/expired, 409 already redeemed |

### PUT/DELETE `/api/users/me/push-token`

| | |
|--|--|
| **PUT Request** | `{ expoPushToken, platform?, active? }` |
| **DELETE Request** | Optional `{ expoPushToken }` |

### PUT `/api/users/me/location`

| | |
|--|--|
| **Request** | `{ city, state?, latitude, longitude }` (nullable coords) |

### GET `/api/users/me/export`

| | |
|--|--|
| **Response** | GDPR export: profile, pushTokens, events, feedback |

### GET `/api/users/me/recent-cooks`

| | |
|--|--|
| **Query** | `limit` (max 20) |
| **Response** | `{ items: [{ recipe, cookedAt }] }` |

### GET `/api/users` (Admin)

| | |
|--|--|
| **Auth** | Admin Bearer |
| **Response** | `UserProfileResponse[]` max 200 |

---

## Recipe Endpoints

### GET `/api/recipes`

| | |
|--|--|
| **Auth** | Public |
| **Query** | `region`, `diet`, `dietType`, `tag`, `difficulty`, `published`, `view=list\|mobile`, `limit`, `offset` |
| **Response** | `{ items: RecipeResponse[], pagination }` |
| **Caching** | Paginated; no explicit client cache headers |

### GET `/api/recipes/search`

| | |
|--|--|
| **Query** | `q` (min 2 chars), filters, pagination |
| **Response** | Search results (in-memory over up to 3000 recipes) |

### GET `/api/recipes/[id]`

| | |
|--|--|
| **Auth** | Public; unpublished requires admin |
| **Response** | `RecipeResponse` |

### POST `/api/recipes/[id]/view`

| | |
|--|--|
| **Auth** | User required |
| **Response** | `{ ok: true }` |

### POST `/api/recipes/[id]/cooked`

| | |
|--|--|
| **Auth** | User required |
| **Response** | `{ ok: true }` |

### POST `/api/recipes` / PUT / DELETE (Admin)

| | |
|--|--|
| **Auth** | Admin Bearer |
| **Body** | `recipeCreateSchema` / partial update |

### POST `/api/recipe-searches`

| | |
|--|--|
| **Auth** | Optional user |
| **Request** | `{ query, sourceScreen?, resultCount? }` |
| **Response** | `{ id }` |

---

## Recommendations

### GET `/api/recommendations`

| | |
|--|--|
| **Auth** | User required |
| **Query** | `force=true`, `timezone`, `exclude=id1,id2` |
| **Response** | `{ picks, lateNightPick, seasonalRail, mealWindow, fromCache }` |
| **Caching** | DB `userRecommendationCache`; `fromCache` in response |

### POST `/api/recommendations/dismiss`

| | |
|--|--|
| **Request** | `{ recipeId }` |

---

## Reference & Partners

### GET `/api/reference`

| | |
|--|--|
| **Auth** | Public |
| **Response** | `{ regionalCuisines, pantrySections, kitchenStyles, appConfig }` |
| **Caching** | `unstable_cache` 30s (`app-config` tag) |

### GET `/api/partners`

| | |
|--|--|
| **Query** | `region` (default `IN`) |
| **Response** | Partner link array |

### GET `/api/sponsors`

| | |
|--|--|
| **Query** | `placement`, `active` |

---

## Billing

### GET `/api/billing/plans`

| | |
|--|--|
| **Response** | `{ paymentsEnabled, ...catalog }` |

### POST `/api/billing/confirm`

| | |
|--|--|
| **Auth** | User required |
| **Request** | Provider-specific purchase payload |
| **Response** | Updated plan |

### POST `/api/billing/revenuecat/webhook`

| | |
|--|--|
| **Auth** | Webhook Bearer secret |
| **Behavior** | Sync planTier paid/free; idempotent via ProcessedWebhookEvent |

---

## Telemetry & Misc

### POST `/api/affiliate-events`

Optional user. `{ partner, context?, recipeId?, query? }`

### POST `/api/sponsor-events`

Optional user. `{ eventType, brandName, placement, ... }`

### POST `/api/feedback`

Optional user. Category + message.

### GET `/api/announcements/active`

Query `appVersion`. Cached 60s.

### GET `/api/download/apk`

302 redirect to APK URL or `/rasoi-release.apk`

### GET `/api/play-store`

302 redirect to Play Store listing

---

## Cron Endpoints (GET, CRON_SECRET)

| Endpoint | Purpose |
|----------|---------|
| `/api/cron/keep-alive` | Supabase REST ping |
| `/api/cron/db-cleanup` | Prune old logs |
| `/api/cron/update-popularity` | Refresh recipe popularity scores |
| `/api/cron/meal-notifications` | Send meal pick push notifications |

Query params for meal-notifications: `forceSlot`, `userId`, `dryRun`

---

## Error Codes

| Status | Meaning |
|--------|---------|
| 400 | Zod validation failure |
| 401 | Missing/invalid auth |
| 403 | Forbidden (admin, plan protect) |
| 409 | Conflict (duplicate, promo redeemed) |
| 410 | Deprecated endpoint |
| 429 | Rate limited |
| 500 | Server error (`handleApiError`) |

---

## Retry Logic

**Not implemented** at API layer for clients. Mobile `utils/api.ts` shows user-facing network errors without automatic retry.

**Timeout:** Unable to determine explicit timeout from code — uses default `fetch` behavior.

---

## Caching Summary

| Resource | TTL |
|----------|-----|
| app-config | 30s |
| home-announcements | 60s |
| published recipe count | 300s |
| Market pages ISR | 300s |
| Recommendations | Per-user DB cache |
| Cron routes | force-dynamic, no cache |
