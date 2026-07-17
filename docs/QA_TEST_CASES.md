# QA Test Cases

Derived from implemented flows, API smoke script (`rasoi_backend/scripts/qa-api-smoke.ts`), and mobile QA scripts (`rasoi_mobile/scripts/`).

---

## Positive Tests

### Authentication

| ID | Test | Expected |
|----|------|----------|
| TC-AUTH-01 | Cold start without session | Lands on Login screen |
| TC-AUTH-02 | Register with valid email/phone/name | OTP sent, verify succeeds |
| TC-AUTH-03 | Register complete flow | Legal → Onboarding → Pantry → Tabs |
| TC-AUTH-04 | Login existing user OTP | Skips legal consent, reaches tabs |
| TC-AUTH-05 | Guest explore flow | Legal → Onboarding → Pantry → Tabs |
| TC-AUTH-06 | Guest upgrade via Settings | Routes to Register |
| TC-AUTH-07 | Logout from Settings | Returns to Login, session cleared |

### Onboarding & Permissions

| ID | Test | Expected |
|----|------|----------|
| TC-ONB-01 | Complete all onboarding steps | `hasCompletedOnboarding=true` |
| TC-ONB-02 | Grant notification permission | Token syncs to server |
| TC-ONB-03 | Grant location permission | Location PUT succeeds |
| TC-ONB-04 | permissionsOnly revisit | Skips diet step |

### Home & Recommendations

| ID | Test | Expected |
|----|------|----------|
| TC-HOME-01 | Load home tab | Meal picks displayed |
| TC-HOME-02 | Tap meal pick | Opens recipe detail |
| TC-HOME-03 | Seasonal rail scroll | Recipes load |
| TC-HOME-04 | Recent cooks section | Shows cooked recipes |

### Recipes

| ID | Test | Expected |
|----|------|----------|
| TC-REC-01 | Browse recipe list | Paginated load |
| TC-REC-02 | Apply quick filter | Filtered results |
| TC-REC-03 | Search with 2+ chars | Results match query |
| TC-REC-04 | Open recipe detail | Ingredients, steps shown |
| TC-REC-05 | Mark recipe cooked | POST /cooked succeeds |
| TC-REC-06 | Save recipe | Appears in Saved tab |

### Pantry

| ID | Test | Expected |
|----|------|----------|
| TC-PAN-01 | Add ingredient | Pantry updates, match % changes |
| TC-PAN-02 | Remove ingredient | Syncs to server |
| TC-PAN-03 | First signup pantry gate | Cannot skip until pantry touched |

### Saved

| ID | Test | Expected |
|----|------|----------|
| TC-SAV-01 | View saved list | Shows bookmarked recipes |
| TC-SAV-02 | Unsave from detail | Removed from list |

### Settings

| ID | Test | Expected |
|----|------|----------|
| TC-SET-01 | Edit profile name | PATCH succeeds |
| TC-SET-02 | Edit diet preferences | Saved to server |
| TC-SET-03 | Submit feedback | POST /feedback 200 |
| TC-SET-04 | Toggle dark theme | Persists in AsyncStorage |
| TC-SET-05 | Delete guest account | Account removed |

### Premium

| ID | Test | Expected |
|----|------|----------|
| TC-PREM-01 | Start trial (payments on) | planTier=trial, partners unlock |
| TC-PREM-02 | Purchase Rasoi Plus | planTier=paid, ads hidden |
| TC-PREM-03 | Restore purchases | Plan restored from store |
| TC-PREM-04 | Redeem valid promo | Trial extend or yearly discount |

### API Smoke (production)

| ID | Test | Expected |
|----|------|----------|
| TC-API-01 | GET /api/recipes | 200 |
| TC-API-02 | GET /api/reference | 200 with catalogs |
| TC-API-15 | Download redirect | 302 to APK |
| TC-API-16 | APK size | > 50MB when absolute URL |

---

## Negative Tests

| ID | Test | Expected |
|----|------|----------|
| TC-NEG-01 | Register with disposable email | Validation error |
| TC-NEG-02 | Register with invalid phone | Validation error |
| TC-NEG-03 | Login with unregistered email | OTP or sync error |
| TC-NEG-04 | Invalid OTP | Error message, stay on OTP step |
| TC-NEG-05 | Legal consent without checkbox | Cannot continue |
| TC-NEG-06 | PUT pantry with 201 ingredients | 400 validation |
| TC-NEG-07 | PUT saved with 501 recipe IDs | 400 validation |
| TC-NEG-08 | PUT planTier=paid from client | Rejected/ignored |
| TC-NEG-09 | Access tabs without login | Redirect to login |
| TC-NEG-10 | Invalid promo code | Error from redeem API |
| TC-NEG-11 | POST /api/auth/login | 410 Gone |
| TC-NEG-12 | Delete account wrong email confirm | 400 |

---

## Edge Cases

| ID | Test | Expected |
|----|------|----------|
| TC-EDGE-01 | Trial expires mid-session | Effective tier becomes free; modals show |
| TC-EDGE-02 | Network loss on home load | OfflineBanner + cached data |
| TC-EDGE-03 | Empty pantry | Recipes show low match % |
| TC-EDGE-04 | Empty saved list | Empty state CTA |
| TC-EDGE-05 | Recipe unpublished | 404 for non-admin |
| TC-EDGE-06 | Jain diet filter | Jain-safe filtering applied |
| TC-EDGE-07 | Allergy exclusions | Recipes with allergens filtered |
| TC-EDGE-08 | Free plan 3rd partner shop in month | Upsell/paywall |
| TC-EDGE-09 | App backgrounded during OTP | Pending verification bridge handles |
| TC-EDGE-10 | EAS OTA update on launch | Update check after splash |

---

## Permission Tests

| ID | Test | Expected |
|----|------|----------|
| TC-PERM-01 | Deny notifications | App continues; no push token |
| TC-PERM-02 | Deny location | App continues; no geo recommendations |
| TC-PERM-03 | Re-request from Settings | OS dialog shown |
| TC-PERM-04 | Android 13+ POST_NOTIFICATIONS | Permission requested |

---

## Offline Tests

| ID | Test | Expected |
|----|------|----------|
| TC-OFF-01 | Airplane mode on Home | OfflineBanner, cached recipes if any |
| TC-OFF-02 | Airplane mode pantry edit | Optimistic UI; sync fails on reconnect |
| TC-OFF-03 | First launch offline | Reference/recipe cache empty; starter recipes may show |

---

## Security Tests

| ID | Test | Expected |
|----|------|----------|
| TC-SEC-01 | API without auth on /users/me | 401 |
| TC-SEC-02 | Admin route without cookie | Redirect to login |
| TC-SEC-03 | Cron without secret | 401 |
| TC-SEC-04 | RC webhook without secret | 401 |
| TC-SEC-05 | Update planTier via Supabase JWT | Trigger blocks sensitive columns |
| TC-SEC-06 | CORS preflight OPTIONS | 204 with headers |

---

## Performance Tests

| ID | Test | Expected |
|----|------|----------|
| TC-PERF-01 | Recipe list scroll 100+ items | No jank; ads lazy load |
| TC-PERF-02 | Cold start to Login | Splash dismisses < reasonable threshold |
| TC-PERF-03 | GET /api/recipes pagination | Response < 2s on production |

---

## Navigation Tests

| ID | Test | Expected |
|----|------|----------|
| TC-NAV-01 | Android back from recipe detail | Returns to previous tab |
| TC-NAV-02 | Tab switch preserves lazy tabs | Correct tab content |
| TC-NAV-03 | pendingPantrySetup forces pantry | Cannot access other tabs |
| TC-NAV-04 | Notification tap meal_pick | Opens correct recipe |
| TC-NAV-05 | Deep link rasoi:// invalid | Not found screen |

---

## Regression (Frozen Flows)

| ID | Test | Expected |
|----|------|----------|
| TC-REG-01 | Login does NOT show legal consent | Direct to onboarding or tabs |
| TC-REG-02 | Register shows legal consent after OTP | legal-consent?from=register |
| TC-REG-03 | Guest shows legal consent first | legal-consent?from=guest |

---

## Test Execution

```bash
# Backend API smoke
cd rasoi_backend && npx tsx scripts/qa-api-smoke.ts
QA_API_URL=https://rasoiapplication.in npx tsx scripts/qa-api-smoke.ts

# Mobile preflight + device
cd rasoi_mobile && npm run qa:preflight && npm run qa:device
```
