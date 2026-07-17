# Rasoi — Project Documentation Index

**Generated from source code analysis**  
**App version:** 1.0.10 (`rasoi_mobile/package.json`)  
**Production site:** https://rasoiapplication.in  
**Last analyzed:** 2026-07-03

This documentation set reverse-engineers the Rasoi monorepo from implementation only. Where behavior cannot be determined from code, documents state **"Not implemented"** or **"Unable to determine from the code."**

---

## What is Rasoi?

Rasoi is an Indian home-cooking companion delivered as:

| Layer | Technology | Path |
|-------|------------|------|
| Mobile app | Expo / React Native (Expo Router) | `rasoi_mobile/` |
| API & admin | Next.js 16 App Router on Vercel | `rasoi_backend/` |
| Database | Supabase PostgreSQL (`rasoi` schema) | `rasoi_mobile/supabase/migrations/` |

Core value: discover recipes from pantry ingredients, get personalized meal picks, save favourites, and shop missing items via affiliate partners (Blinkit, Zepto, Zomato, Swiggy).

---

## Documentation Map

| Document | Audience | Contents |
|----------|----------|----------|
| [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) | Architects, leads | End-to-end system design, data flow, integrations |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Developers | Folder layout, modules, config files |
| [USER_FLOW.md](./USER_FLOW.md) | PM, QA | Every user journey with steps and decision points |
| [NAVIGATION_MAP.md](./NAVIGATION_MAP.md) | Mobile devs, QA | Screen graph, auth gates, navigation types |
| [SCREEN_DOCUMENTATION.md](./SCREEN_DOCUMENTATION.md) | QA, designers | Per-screen inventory (22 mobile screens) |
| [DATABASE.md](./DATABASE.md) | Backend, DBA | Tables, RLS, triggers, relationships |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | Integrators | REST endpoints, auth, payloads |
| [BUSINESS_RULES.md](./BUSINESS_RULES.md) | PM, QA | Plans, validation, limits, permissions logic |
| [QA_TEST_CASES.md](./QA_TEST_CASES.md) | QA | Positive, negative, edge, security tests |
| [SECURITY_REVIEW.md](./SECURITY_REVIEW.md) | Security | Auth, secrets, storage, vulnerabilities |
| [USER_GUIDE.md](./USER_GUIDE.md) | End users | Non-technical manual |
| [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) | Developers | Setup, build, release, CI/CD |
| [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) | All | Documented gaps and limitations |
| [IMPROVEMENT_REPORT.md](./IMPROVEMENT_REPORT.md) | Engineering | Tech debt, UX, maintainability |
| [USER_GUIDE.pdf](./USER_GUIDE.pdf) | Clients, testers | Printable user manual |

---

## Scope Notes

### In scope (documented)

- Mobile app: all routes under `rasoi_mobile/app/`
- Backend: public API (`/api/*`), marketing pages, admin console
- Database: `rasoi` schema + relevant Supabase auth integration
- Edge functions: `rasoi-auth-sync`, `rasoi-auth-guest` (referenced in mobile services)

### Out of scope / partial

- **Forgot password:** Not implemented — auth is email OTP only; no password reset flow in code
- **Invite user / pantry sharing:** Not implemented — pantry is per-user JSON column, no multi-member pantry
- **iOS production release:** Code supports iOS build scripts; primary shipping target is Android
- **Universal links:** Custom scheme `rasoi://` only; no associated domains in `app.json`
- **Remote feature flags:** Not implemented — env toggles and server `paymentsEnabled` only

---

## Quick Reference — Mobile Tab Structure

```
Home | Recipe | Pantry | Saved | Settings
```

Auth stack (pre-tabs): Login → Register → Legal Consent → Onboarding → Trial Welcome

Stack overlays: Recipe Detail (`/recipe/[id]`), Paywall (`/paywall`)

---

## Related Internal Docs (pre-existing)

- `rasoi_backend/README.md` — backend setup
- `rasoi_mobile/docs/PRODUCTION_CHECKLIST.md` — release checklist
- `rasoi_mobile/docs/PUSH_SETUP.md` — push notification setup
- `.cursor/rules/mobile-auth-navigation-flow.mdc` — frozen auth flow spec
