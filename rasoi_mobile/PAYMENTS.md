# Rasoi payments (decide provider later)

The app uses a **provider-agnostic paywall**. Billing is **not live** until you set a provider and keys.

## Current default: `stub`

- Subscribe on the paywall updates Rasoi Plus via `PUT /api/users/me/plan` (for testing).
- No money is charged.
- Set in `.env`:

```bash
EXPO_PUBLIC_PAYMENT_PROVIDER=stub
```

## Recommended when you go live

| Channel | Provider | Why |
|---------|----------|-----|
| **iOS + Android app** | **RevenueCat** (`react-native-purchases`) | Handles App Store + Play subscriptions, restore, trials; one SDK for both stores. |
| **India UPI / web checkout** | **Razorpay** | Strong UPI + cards; good if you add web or hybrid checkout. |
| **Web-only global** | **Stripe** | Best for browser; add later if you ship `expo-web` subscriptions. |

For this Expo app, **RevenueCat + native IAP** is the best fit once you pick mobile billing.

## Switch provider (later)

```bash
# .env
EXPO_PUBLIC_PAYMENT_PROVIDER=revenuecat
# Dev / sandbox (RevenueCat Test Store):
EXPO_PUBLIC_REVENUECAT_TEST_KEY=test_SJxxLWvHNMyNuMgqvvFMAhddtiC
# Production (after Play / App Store products are linked):
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_HHYkVegKPcskYJYCtbxGuPGMahj
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_...
```

RevenueCat project **Rasoi App** is configured with:

| Resource | Identifier |
|----------|------------|
| Entitlement | `rasoi_plus` |
| Offering (current) | `default` |
| Monthly package | `$rc_monthly` → `rasoi_plus_monthly` |
| Annual package | `$rc_annual` → `rasoi_plus_yearly` |

Turn **Payment** ON in admin (`/admin/payments`) before testing live billing.

Server webhook verification (optional hardening): `rasoi_backend/src/app/api/billing/confirm/route.ts`

## Code map

| File | Role |
|------|------|
| `constants/payments.ts` | Provider id, product id, disclaimers |
| `services/payments/revenueCatClient.ts` | SDK configure, purchase, restore |
| `services/payments/revenueCatProvider.ts` | PaymentProvider for RevenueCat |
| `components/RevenueCatBridge.tsx` | Init SDK + link user id |
| `hooks/usePaywall.ts` | Loading state + subscribe / restore UI |
| `components/paywall/` | Shared compare table + CTAs |
| `app/(tabs)/settings/paywall.tsx` | Full paywall screen |
| `app/(auth)/trial-welcome.tsx` | Post-registration trial upsell (full screen) |
| `components/TrialWelcomeContent.tsx` | Shared trial welcome UI |
| `context/AppContext.tsx` | `upgradeToPaid`, `restorePurchases` |
| `005/.../billing/confirm/route.ts` | Future server webhook verification |

## Product ids & pricing

| Plan | Price | Product id |
|------|-------|------------|
| Plus monthly | ₹49/month | `rasoi_plus_monthly` |
| Plus yearly | ₹499/year (~₹42/mo, **Save 15% · ₹89/year** vs ₹588) | `rasoi_plus_yearly` |

Map both ids in App Store Connect, Google Play, and RevenueCat when ready.

## Trial vs paid

- **Trial** — free, no payment; started via `PUT /api/users/me/plan` (`planTier: trial`).
- **Paid** — goes through payment provider → confirm on server → `planTier: paid`.
