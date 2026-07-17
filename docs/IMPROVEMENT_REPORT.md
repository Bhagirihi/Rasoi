# Improvement Report

Engineering observations from static code analysis. Not a prioritized roadmap.

---

## Unused / Dead Code Candidates

| Item | Evidence |
|------|----------|
| `POST /api/auth/login` | Returns 410; mobile never calls |
| Legacy `public` recipe tables | Dropped in migration |
| `public.handle_new_user` trigger | May be stale vs `rasoi.User` model |
| Razorpay provider | Stub without checkout UI |
| `PAID_PLAN_PRICE` deprecated alias | Marked `@deprecated` in plans.ts |

**Verification needed:** Run dead code analysis before removal.

---

## Duplicate / Parallel Implementations

| Area | Details |
|------|---------|
| Push tokens | `public.push_tokens` (legacy) vs `rasoi.PushToken` (active) |
| Auth paths | Supabase Edge Functions + API routes for sync/guest |
| Recipe data path | API vs direct Supabase reads (env toggle) |
| Plan storage | Server DB + local `planStorage.ts` cache |

---

## Navigation Issues

| Issue | Impact |
|-------|--------|
| Multiple redirect layers | index.tsx + tabs/_layout.tsx both guard — can cause double redirect flash |
| pendingPantrySetup blocks all tabs | Intentional but may confuse users |
| No universal deep links | Marketing links cannot open specific recipes in app |

---

## Performance

| Area | Observation |
|------|-------------|
| Recipe search server-side | In-memory scan up to 3000 recipes — may not scale |
| Ad insertion in lists | Multiple viewability hooks — complex scroll performance |
| Large recipe catalog | Client pagination helps; initial hydrate may be heavy |
| Realtime subscriptions | Multiple tables — monitor battery/data on mobile |

---

## UX Problems

| Issue | Details |
|-------|---------|
| No explicit offline mode indicator globally | Only OfflineBanner on Home |
| Trial expiry | Modal-based; no persistent banner on all screens |
| Guest limitations | May not be clear until partner upsell |
| OTP resend UX | Unable to determine cooldown UI from partial read |
| No forgot email help | Users with wrong email have no recovery beyond retry |

---

## Accessibility

| Gap | Notes |
|-----|-------|
| testIds present | Good for automation (`constants/testIds.ts`) |
| Screen reader audit | Not performed in this analysis |
| Color contrast in dark mode | ThemeContext exists; WCAG compliance not verified |
| Font scaling | Unable to determine dynamic type support |

---

## Potential Bugs

| Risk | Source |
|------|--------|
| Plan desync client/server | Local planStorage vs server on network failure |
| Race on guest upgrade | linkGuestUserId timing with OTP |
| Permission state vs OS | permissionsOnboardingComplete may desync if user revokes in OS settings |
| Trial time zone | Server Asia/Kolkata default; client local time for display |

---

## Maintainability

| Issue | Recommendation Area |
|-------|---------------------|
| AppContext size | Large god context — consider splitting |
| 89 component files | Domain folders help; some overlap in paywall/settings |
| No Prisma client | schema.prisma must stay manually synced with migrations |
| Frozen auth flows | Good for stability; increases change cost |
| Monorepo deploy coupling | APK sync required for app releases |

---

## Security Improvements

| Item | Priority |
|------|----------|
| Migrate to SecureStore for tokens | High |
| Certificate pinning | Low-Medium |
| Distributed rate limiting | Medium for auth endpoints |
| Audit ALLOW_STUB_BILLING in prod | High |

---

## Testing Gaps

| Gap | Notes |
|-----|-------|
| No unit test suite found | QA relies on device scripts |
| E2E in `rasoi_mobile/e2e/` | Exists but scope unclear |
| Admin console E2E | Not found |

---

## Documentation Debt

| Item | Status |
|------|--------|
| Root README version | Out of date vs 1.0.10 |
| API OpenAPI spec | Not generated |
| This documentation set | New — should be updated on major releases |

---

## Unused Screens

All 22 mobile route files appear reachable via navigation graph. **No orphaned screens identified.**

`+html.tsx` is web-only shell for static rendering — not a user-facing mobile screen.

---

## Summary

The codebase is functional and reasonably structured for a small team monorepo. Highest-impact improvements: secure token storage, navigation/deep link polish, AppContext decomposition, and automated test coverage beyond device QA scripts.
