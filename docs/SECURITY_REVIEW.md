# Security Review

Analysis based on `rasoi_mobile/` and `rasoi_backend/` source code. This is a code review, not a penetration test.

---

## Sensitive Data

| Data | Storage | Risk |
|------|---------|------|
| Supabase session | AsyncStorage | Medium — not encrypted at rest |
| Rasoi JWT (`@rasoi/auth_token`) | AsyncStorage | Medium — long-lived (~400d user tokens) |
| User profile cache | AsyncStorage | Low |
| Admin password hash | PostgreSQL `rasoi.Admin.passwordHash` | Low — bcrypt |
| RevenueCat API keys | Server env only | Low if env secured |
| Service role key | Server env only | **High** if leaked — full DB access |

**SecureStore / Keychain:** Not implemented for mobile tokens.

---

## Secrets & Environment

| Secret | Location | Exposure |
|--------|----------|----------|
| `JWT_SECRET` | Vercel env | Server only; required in prod |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel env | Server only |
| `CRON_SECRET` | Vercel + Supabase Vault | Cron auth |
| `REVENUECAT_WEBHOOK_SECRET` | Vercel env | Webhook auth |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Mobile bundle | Expected public anon key |
| `EXPO_PUBLIC_SENTRY_DSN` | Mobile bundle | Expected public |
| `EXPO_PUBLIC_REVENUECAT_*` | Mobile bundle | Expected public SDK keys |

**`.env` files:** Must not be committed (`.env.example` only in repo).

---

## Authentication Flow

| Aspect | Implementation | Assessment |
|--------|----------------|------------|
| User auth | Supabase OTP + Rasoi JWT | Standard |
| Token verification | `getUser()` via service role | Correct server-side validation |
| Admin auth | bcrypt + HttpOnly cookie | Good for web admin |
| Guest auth | Anonymous Supabase + API | Acceptable with terms acceptance |
| Legacy login | Disabled (410) | Good |

**Session expiry UI:** Not implemented — relies on token refresh.

---

## Authorization

| Layer | Mechanism |
|-------|-----------|
| API user routes | `requireUser()` — Supabase or JWT |
| Admin API | `requireAdmin()` Bearer |
| Admin pages | Cookie check in layout |
| Mobile RLS | `supabaseUserId = auth.uid()` |
| Plan mutations | DB trigger blocks JWT direct updates |
| Unpublished recipes | Admin Bearer required |

**Potential gap:** Tables without RLS (PromoCode, HomeAnnouncement, recommendation tables) rely entirely on service role — acceptable if no direct client access.

---

## Potential Vulnerabilities

| Issue | Severity | Details |
|-------|----------|---------|
| JWT in AsyncStorage | Medium | Physical device access could extract token |
| Rate limits in-memory | Low | Not shared across Vercel instances |
| No certificate pinning | Low | Standard for most apps |
| `ALLOW_STUB_BILLING` in prod | Medium | Must remain unset/false in production |
| Admin seed credentials in README | Medium | Default creds for local dev only |
| CORS `API_CORS_ORIGINS` | Low | Misconfiguration could widen origins |

---

## Missing Validation

| Area | Status |
|------|--------|
| Client-side pantry limit | Server enforces 200; client should match |
| Recipe ID format on client | Server validates on write endpoints |
| File upload | Not implemented — N/A |
| Invite/spam on guest creation | Rate limited 20/min/IP |

---

## Unsafe Storage

| Item | Issue |
|------|-------|
| Auth tokens in AsyncStorage | Not hardware-backed |
| Supabase session in AsyncStorage adapter | Same |
| Logged-out flag | AsyncStorage — low risk |

**Recommendation (not implemented):** Migrate tokens to `expo-secure-store`.

---

## Database Security

| Control | Status |
|---------|--------|
| RLS on user data | Implemented |
| Sensitive column trigger | Implemented |
| Service role bypass for backend | Required for admin |
| SQL injection | Parameterized via PostgREST/pg |
| Promo redemption race | Server-side transaction (verify in code path) |

---

## API Security

| Control | Status |
|---------|--------|
| HTTPS only (production) | Yes |
| Cron secret timing-safe compare | `cron-auth.ts` |
| Webhook timing-safe compare | RevenueCat auth |
| Zod input validation | All mutation routes |
| Error details stripped in prod | Zod flatten limited |

---

## Mobile Permissions

| Permission | Justification |
|------------|---------------|
| INTERNET | API calls |
| LOCATION | Meal recommendations, sponsor geo |
| POST_NOTIFICATIONS | Meal reminders |
| VIBRATE | Notification feedback |

**Over-privileged:** Unable to determine unnecessary permissions from code; standard Expo Android manifest includes some defaults.

---

## Third-Party Data Sharing

| Service | Data Sent |
|---------|-----------|
| Sentry | Errors, breadcrumbs |
| Firebase Analytics | Screen events (if enabled) |
| RevenueCat | User ID, purchase events |
| AdMob | Ad serving identifiers |
| Expo Push | Push tokens |
| Affiliate partners | Search queries on deep link |

---

## Compliance Notes

| Feature | Status |
|---------|--------|
| Terms acceptance tracking | `termsAcceptedAt`, `termsAcceptedVersion` |
| Account deletion | `DELETE /api/users/me` |
| Data export | `GET /api/users/me/export` |
| Privacy policy page | `/privacy` |

---

## Security Test Checklist

See [QA_TEST_CASES.md](./QA_TEST_CASES.md) TC-SEC-* series.
