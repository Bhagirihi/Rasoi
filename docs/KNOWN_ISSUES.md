# Known Issues

Documented limitations and gaps identified from source code analysis. Not a bug tracker.

---

## Authentication & Account

| Issue | Status | Notes |
|-------|--------|-------|
| Forgot password flow | Not implemented | OTP-only auth; no password reset |
| Session expired screen | Not implemented | User redirected to login via guards |
| Secure token storage | Not implemented | AsyncStorage only, not SecureStore |
| Legacy phone login API | Disabled | Returns 410 |

---

## Features Not Implemented

| Feature | Status |
|---------|--------|
| Invite user / shared pantry | Not implemented |
| Multi-member pantry | Not implemented |
| Universal links / App Links | Not implemented |
| Remote feature flags | Not implemented |
| Offline write queue | Not implemented |
| Razorpay live checkout | Stub only |
| Camera / photo permissions | Not implemented |
| iOS production release | Scripts exist; Android is primary |

---

## Mobile

| Issue | Notes |
|-------|-------|
| Remote push in Expo Go | Unavailable on Android Expo Go |
| NetInfo global offline mode | Not implemented; per-screen degradation only |
| README version mismatch | Root README shows v1.0.0; package.json is 1.0.10 |
| Debug keystore for release | README notes Play Store needs production keystore |

---

## Backend

| Issue | Notes |
|-------|-------|
| In-memory rate limits | Not distributed across Vercel instances |
| Recipe search in-memory cap | Max 3000 recipes scanned |
| Prisma client removed | schema.prisma is reference only — do not expect `prisma migrate` |
| Legacy public schema tables | Partially dropped; may confuse DB inspection |

---

## Database

| Issue | Notes |
|-------|-------|
| No FK on recipeId in event tables | Orphan references possible if recipe deleted |
| HomeAnnouncement no RLS | Backend service role only |
| Dual push token tables | Legacy `public.push_tokens` + `rasoi.PushToken` |

---

## Deployment

| Issue | Notes |
|-------|-------|
| Vercel Hobby cron limits | meal-notifications on Supabase pg_cron |
| APK must be synced before deploy | Manual `npm run sync:apk` step |
| main branch frozen | Feature work on `development` |

---

## Documentation Gaps

| Item | Notes |
|------|-------|
| Exact fetch timeout | Unable to determine from code |
| CI/CD pipeline file | No `.github/workflows` found in exploration — verify locally |

---

## Frozen Flow Constraints

Per `.cursor/rules/mobile-auth-navigation-flow.mdc`:

- Auth step order must not change without approval
- Login must not show legal consent
- Guest must not skip onboarding with defaults

Violations are considered regressions, not optional improvements.
