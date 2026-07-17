# Screen Documentation

Complete inventory of **mobile app screens** (22 route files). Screenshot placeholders included for QA asset collection.

**Legend:** API calls via `authApiFetch` unless noted. State from `AppContext` unless noted.

---

## 1. Bootstrap / Index

| Field | Value |
|-------|-------|
| **Screen Name** | Bootstrap Router |
| **File Path** | `rasoi_mobile/app/index.tsx` |
| **Purpose** | Cold-start routing after hydration |
| **Screenshot** | `[PLACEHOLDER: bootstrap-loading]` |

**UI Components:** `AppSavingOverlay` with bootstrap steps

**Input Fields:** None

**Buttons:** None

**Validation:** Async checks for legal consent, permissions, auth flags

**Business Logic:** Redirect chain per auth/onboarding/pantry/trial state

**APIs Called:** None directly (context hydration may call APIs)

**State Used:** `isHydrated`, `isLoggedIn`, `hasCompletedOnboarding`, `pendingTrialWelcome`, `pendingPantrySetup`, `userCity`

**Permissions Required:** None

**Entry:** App launch after splash

**Exit:** Redirect to destination (no user stay)

**Next Screens:** Login, Legal Consent, Onboarding, Pantry, Trial Welcome, Tabs

**Previous:** Launch Splash

**Error States:** Loading overlay until checks complete

**Empty States:** N/A

---

## 2. Login

| Field | Value |
|-------|-------|
| **Screen Name** | Login |
| **File Path** | `rasoi_mobile/app/(auth)/login.tsx` |
| **Purpose** | Email OTP login and guest entry |
| **Screenshot** | `[PLACEHOLDER: login-email]` `[PLACEHOLDER: login-otp]` |

**UI Components:** `ScrollViewWithFloatingIndicator`, `RasoiBrandIcon`, `GuestContinueModal`, `AppSavingOverlay`, `LinearGradient`

**Input Fields:** Email (`TextInput`), OTP (`TextInput`), Guest name (modal)

**Buttons:** Continue (send OTP), Verify OTP, Back, Create account, Explore as Guest

**Validation Rules:**
- Email: `getLoginEmailValidationError()` — format, disposable email blocked
- OTP: required non-empty

**Business Logic:** Two-step `email` → `otp`; `resolvePostAuthHref` / `resolveGuestLoginHref` after verify

**APIs Called:**
- Supabase OTP send/verify
- `POST /api/auth/supabase-sync` (via context)
- `POST /api/auth/guest` (guest path)

**State Used:** `sendLoginEmailOtp`, `verifyLoginEmailOtp`, `loginAsGuest`, `pendingPantrySetup`

**Permissions Required:** None

**Entry:** No session on cold start; logout

**Exit:** Successful auth → post-auth route

**Next Screens:** Register, Onboarding, Legal Consent (guest), Tabs

**Previous:** Bootstrap

**Error States:** Field errors (email/otp/general), email delivery blocked message

**Empty States:** N/A

---

## 3. Register

| Field | Value |
|-------|-------|
| **Screen Name** | Register |
| **File Path** | `rasoi_mobile/app/(auth)/register.tsx` |
| **Purpose** | New account signup with OTP |
| **Screenshot** | `[PLACEHOLDER: register-details]` `[PLACEHOLDER: register-otp]` |

**UI Components:** Similar to Login; `TermsAcceptanceModal` may appear

**Input Fields:** Name, Phone (Indian), Email, OTP

**Buttons:** Send OTP, Verify, Back to Login

**Validation Rules:**
- Name: min 2 chars (server: 2–80)
- Phone: Indian 10-digit `^[6-9]\d{9}$`, no dummy numbers
- Email: valid, not disposable

**Business Logic:** OTP → `legal-consent?from=register`; guest upgrade uses `guest_upgrade` flow

**APIs Called:** Supabase OTP; `POST /api/auth/supabase-sync` with optional `linkGuestUserId`

**State Used:** `sendEmailOtp`, `verifyEmailOtpAndLogin`

**Permissions Required:** None

**Entry:** Login CTA; Settings guest upgrade

**Exit:** Legal consent screen

**Next Screens:** Legal Consent, Login

**Previous:** Login, Settings

**Error States:** Validation errors, OTP failure

**Empty States:** N/A

---

## 4. Legal Consent

| Field | Value |
|-------|-------|
| **Screen Name** | Terms & Privacy |
| **File Path** | `rasoi_mobile/app/(auth)/legal-consent.tsx` |
| **Purpose** | Accept terms before continuing (register/guest) |
| **Screenshot** | `[PLACEHOLDER: legal-consent]` |

**UI Components:** Terms/Privacy links via `expo-linking`

**Input Fields:** Checkbox acceptance

**Buttons:** Continue (requires acceptance)

**Validation:** Must accept terms (`saveLegalConsent`)

**Business Logic:** `from=register` vs `from=guest` query param

**APIs Called:** Terms version stored locally; may sync on next API call

**State Used:** `hasLegalConsent`, navigation after save

**Permissions Required:** None

**Entry:** Register OTP success; guest first login; index bootstrap

**Exit:** Onboarding

**Next Screens:** Onboarding

**Previous:** Register, Login (guest)

**Error States:** Cannot continue without checkbox

**Empty States:** N/A

---

## 5. Onboarding

| Field | Value |
|-------|-------|
| **Screen Name** | Onboarding |
| **File Path** | `rasoi_mobile/app/(auth)/onboarding.tsx` |
| **Purpose** | Food preferences + OS permissions |
| **Screenshot** | `[PLACEHOLDER: onboarding-diet]` `[PLACEHOLDER: onboarding-notifications]` `[PLACEHOLDER: onboarding-location]` |

**UI Components:** `PermissionOnboardingStep`, cuisine/diet selectors

**Input Fields:** Diet choice, regional cuisine, favorite cuisines, notification toggle

**Buttons:** Next, Skip (permissions may be skippable per step), Allow notifications, Allow location

**Validation:** Diet and cuisine selections required for full onboarding

**Business Logic:**
- Steps: 1) Food prefs 2) Notifications 3) Location
- `permissionsOnly=1` skips food prefs
- `POST /api/users/me/onboarding` on completion

**APIs Called:** `POST /api/users/me/onboarding`, `PUT /api/users/me/location`

**State Used:** `completeOnboarding`, reference cuisines

**Permissions Required:** Notifications (`POST_NOTIFICATIONS`), Location (`ACCESS_FINE_LOCATION`)

**Entry:** Legal consent, login (incomplete onboarding), permissions revisit

**Exit:** Pantry or tabs via `resolvePostAuthHref`

**Next Screens:** Pantry, Trial Welcome, Tabs

**Previous:** Legal Consent, Login

**Error States:** API failure on save

**Empty States:** N/A

---

## 6. Trial Welcome

| Field | Value |
|-------|-------|
| **Screen Name** | Trial Welcome |
| **File Path** | `rasoi_mobile/app/(auth)/trial-welcome.tsx` |
| **Purpose** | Offer Rasoi Plus trial after signup |
| **Screenshot** | `[PLACEHOLDER: trial-welcome]` |

**UI Components:** Feature list from `TRIAL_WELCOME_FEATURES`

**Buttons:** Start trial, Upgrade to paid, Maybe later (dismiss)

**Business Logic:** `startTrial`, `upgradeToPaid`, `dismissTrialWelcome`; requires `paymentsEnabled`

**APIs Called:** Trial via `rasoi.start_trial()` RPC or plan API

**State Used:** `pendingTrialWelcome`, plan state

**Permissions Required:** None

**Entry:** `pendingTrialWelcome` flag after new signup

**Exit:** Tabs

**Next Screens:** Tabs, Paywall

**Previous:** Onboarding, Pantry

**Error States:** Trial start failure if payments disabled

**Empty States:** N/A

---

## 7. Home (Dashboard)

| Field | Value |
|-------|-------|
| **Screen Name** | Home |
| **File Path** | `rasoi_mobile/app/(tabs)/index.tsx` |
| **Purpose** | Personalized dashboard with meal picks |
| **Screenshot** | `[PLACEHOLDER: home-dashboard]` |

**UI Components:** `HomeRecipeRow`, `HomeSeasonalRail`, `HomeRecentCooks`, `HomeAnnouncementBanner`, `GuestRegisterBanner`, `OfflineBanner`, `AppTabHeader`, sponsor/ad placements

**Input Fields:** None (search not on home)

**Buttons:** Recipe cards, See all, announcement CTA, partner CTAs

**Business Logic:** `useRecipeDiscovery`, `useHomeAnnouncement`, meal pick shuffle

**APIs Called:** `GET /api/recommendations`, `GET /api/announcements/active`, `GET /api/users/me/recent-cooks`

**State Used:** `TonightRecipesContext`, `AppContext`, `PartnersContext`

**Permissions Required:** None (location used for recommendations if available)

**Entry:** Tab bar, notification `daily_reminder`

**Exit:** Tab switch, recipe detail

**Next Screens:** Recipe detail, Paywall, partner modals

**Previous:** Any tab

**Error States:** `OfflineBanner` when recipes fail to load

**Empty States:** Shown when no picks available (fallback messaging in components)

---

## 8. Recipes (Browse)

| Field | Value |
|-------|-------|
| **Screen Name** | Recipe Browse |
| **File Path** | `rasoi_mobile/app/(tabs)/recipes.tsx` |
| **Purpose** | Search and filter recipe catalog |
| **Screenshot** | `[PLACEHOLDER: recipes-browse]` `[PLACEHOLDER: recipes-search]` |

**UI Components:** `RecipeCard`, `CookTonightSheet`, `AdMobBanner`, filter chips, search bar

**Input Fields:** Search query (`TextInput`)

**Buttons:** Quick filters (under20, leftover, kids, etc.), pantry mode toggle, load more

**Validation:** Debounced search

**Business Logic:** `useRecipeListSearch`, `useRecipeDiscovery`, infinite scroll, ad insertion

**APIs Called:** `GET /api/recipes`, `POST /api/recipe-searches`

**State Used:** `RecipesContext`, `AppContext` (pantry)

**Permissions Required:** None

**Entry:** Tab bar, notification `admin_message`

**Exit:** Tab switch, recipe detail

**Next Screens:** Recipe detail, CookTonightSheet selections

**Previous:** Any tab

**Error States:** Load error in context

**Empty States:** No results for search/filter

---

## 9. Pantry

| Field | Value |
|-------|-------|
| **Screen Name** | Pantry |
| **File Path** | `rasoi_mobile/app/(tabs)/pantry.tsx` |
| **Purpose** | Manage home ingredients |
| **Screenshot** | `[PLACEHOLDER: pantry-main]` |

**UI Components:** `PantryHeroCard`, `PantrySectionCard`, `GroceryPromoStrip`, `PartnerUpsellCard`

**Input Fields:** Ingredient search/add (if implemented in screen)

**Buttons:** Ingredient toggles, section expand, partner shop CTA

**Validation:** Max 200 ingredients (server)

**Business Logic:** `usePantryScreenData`, `pendingPantrySetup` clearance on first save

**APIs Called:** `PUT /api/users/me/pantry`

**State Used:** `AppContext.pantryIngredients`, `ReferenceContext.pantrySections`

**Permissions Required:** None

**Entry:** Tab bar, forced first-time setup

**Exit:** Tab switch after setup complete

**Next Screens:** Paywall (partner limit), partner modals

**Previous:** Onboarding, tabs

**Error States:** Sync failure (optimistic revert)

**Empty States:** Empty pantry prompt to add staples

---

## 10. Saved

| Field | Value |
|-------|-------|
| **Screen Name** | Saved Recipes |
| **File Path** | `rasoi_mobile/app/(tabs)/saved.tsx` |
| **Purpose** | Bookmarked recipes list |
| **Screenshot** | `[PLACEHOLDER: saved-recipes]` |

**UI Components:** `RecipeCard`, pantry match badges, affiliate modal

**Input Fields:** None

**Buttons:** Recipe cards, shop missing items

**Business Logic:** `useSavedRecipes` resolves IDs to full recipes

**APIs Called:** `GET /api/users/me/saved-recipes`, recipe catalog fetch

**State Used:** `AppContext.savedRecipeIds`, `RecipesContext`

**Permissions Required:** None

**Entry:** Tab bar

**Exit:** Recipe detail

**Next Screens:** Recipe detail

**Previous:** Any tab

**Error States:** Recipe not found in catalog

**Empty States:** No saved recipes CTA to browse

---

## 11. Settings

| Field | Value |
|-------|-------|
| **Screen Name** | Settings Hub |
| **File Path** | `rasoi_mobile/app/(tabs)/settings/index.tsx` |
| **Purpose** | Account, plan, preferences, logout |
| **Screenshot** | `[PLACEHOLDER: settings-main]` |

**UI Components:** `SettingsBlocks`, `LocationCard`, `SyncStatusCard`, `RateRasoiCard`, plan badge

**Input Fields:** None on hub

**Buttons:** Edit profile, Edit preferences, Feedback, Rasoi Plus, Log out, Delete account, Theme toggle, Sign up (guest)

**Business Logic:** Plan display, guest upgrade routing to Register

**APIs Called:** Various on sub-actions

**State Used:** Full `AppContext`, `ThemeContext`

**Permissions Required:** None

**Entry:** Tab bar

**Exit:** Sub-screens or logout

**Next Screens:** edit-profile, edit-preferences, feedback, paywall, register, login

**Previous:** Tab bar

**Error States:** Delete account confirmation failures

**Empty States:** N/A

---

## 12. Edit Profile

| Field | Value |
|-------|-------|
| **Screen Name** | Edit Profile |
| **File Path** | `rasoi_mobile/app/(tabs)/settings/edit-profile.tsx` |
| **Purpose** | Update name and phone |
| **Screenshot** | `[PLACEHOLDER: edit-profile]` |

**Input Fields:** Name, Phone

**Buttons:** Save, Back

**Validation:** Name 2–80 chars; Indian phone format

**APIs Called:** `PATCH /api/users/me`

**State Used:** `AppContext.user`

**Entry:** Settings

**Exit:** Settings

**Error States:** Validation, API errors

**Empty States:** Guest may see upgrade prompt

---

## 13. Edit Preferences

| Field | Value |
|-------|-------|
| **Screen Name** | Edit Preferences |
| **File Path** | `rasoi_mobile/app/(tabs)/settings/edit-preferences.tsx` |
| **Purpose** | Diet, cuisines, allergies, household, notifications |
| **Screenshot** | `[PLACEHOLDER: edit-preferences]` |

**Input Fields:** Diet, cuisines, allergy exclusions, household size, notifications toggle

**Buttons:** Save

**Validation:** `kitchenPreferencesSchema` — household 1–12, allergies max 20

**APIs Called:** `PATCH /api/users/me`

**State Used:** `AppContext`, `ReferenceContext`

---

## 14. Feedback

| Field | Value |
|-------|-------|
| **Screen Name** | Feedback |
| **File Path** | `rasoi_mobile/app/(tabs)/settings/feedback.tsx` |
| **Purpose** | Submit in-app feedback |
| **Screenshot** | `[PLACEHOLDER: feedback]` |

**Input Fields:** Category, Message, optional Name/Email

**Buttons:** Submit

**APIs Called:** `POST /api/feedback`

**Validation:** Message required (per schema in route)

---

## 15. Recipe Detail

| Field | Value |
|-------|-------|
| **Screen Name** | Recipe Detail |
| **File Path** | `rasoi_mobile/app/recipe/[id].tsx` |
| **Purpose** | Full recipe view with cook/save/shop actions |
| **Screenshot** | `[PLACEHOLDER: recipe-detail]` |

**UI Components:** `IngredientList`, `MissingItemsPanel`, `MissingShopInline`, `RecipeImage`, `RecipeSafetyDisclaimer`, `FoodDeliveryStrip`, `SponsorOrAd`

**Buttons:** Save, Share, Mark cooked, Shop missing, Delivery partners, Back

**Business Logic:** Pantry match %, partner gating by plan, view/cook logging

**APIs Called:** `GET /api/recipes/:id`, `POST /api/recipes/:id/view`, `POST /api/recipes/:id/cooked`, `PUT /api/users/me/saved-recipes`

**State Used:** `AppContext`, `PartnersContext`, plan state

**Entry:** Home, Recipes, Saved, notification `meal_pick`, deep link

**Exit:** Back to previous stack

**Error States:** Recipe not found

**Empty States:** N/A

---

## 16. Paywall

| Field | Value |
|-------|-------|
| **Screen Name** | Rasoi Plus Paywall |
| **File Path** | `rasoi_mobile/app/paywall.tsx` |
| **Purpose** | Subscription purchase screen |
| **Screenshot** | `[PLACEHOLDER: paywall]` |

**UI Components:** `PaywallPricingSection`, `PaywallPlanCards`, `PaywallActions`, `PaywallCompareTable`, `PromoCodeInput`

**Buttons:** Subscribe monthly/yearly, Restore purchases, Apply promo

**Business Logic:** `usePaywall`, `useRevenueCatPricing`; gated by `paymentsEnabled`

**APIs Called:** RevenueCat SDK; `POST /api/billing/confirm`; `POST /api/users/me/promo/redeem`

**State Used:** Plan state, `ReferenceContext.paymentsEnabled`

---

## 17. Not Found

| Field | Value |
|-------|-------|
| **Screen Name** | 404 |
| **File Path** | `rasoi_mobile/app/+not-found.tsx` |
| **Purpose** | Invalid route fallback |
| **Screenshot** | `[PLACEHOLDER: not-found]` |

**Buttons:** Link to home `/`

---

## Global Overlays (not screens)

| Component | Purpose |
|-----------|---------|
| `TrialExpiredPaywallModal` | Post-trial upsell |
| `TrialEndingSoonModal` | Pre-expiry reminder |
| `LaunchSplash` | Brand splash |
| `AppSavingOverlay` | Loading states |
| `OfflineBanner` | Network degradation |

---

## Backend Web Pages (non-mobile)

Documented for QA completeness — not mobile screens:

| Page | Path |
|------|------|
| India landing | `/` |
| Download | `/download` |
| Play Store SEO | `/play-store` |
| Privacy | `/privacy` |
| Terms | `/terms` |
| Delete account info | `/delete-account` |
| Admin login | `/admin/login` |
| Admin dashboard | `/admin` |
| SEO articles | `/[slug]`, `/recipes/[slug]` |
