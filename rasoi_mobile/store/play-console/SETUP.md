# Rasoi APP — Google Play Console Setup

**Developer account:** Bhagihiri Applications  
**App name (Play Console):** Rasoi APP  
**Package:** `com.bhagihiri.rasoiapp`  
**Source of truth:** [`manifest.json`](./manifest.json) (derived from mobile code)

## What Google allows

| Step | Automated? | How |
|------|------------|-----|
| Create developer account "Bhagihiri Applications" | Manual | [Play Console signup](https://play.google.com/console/signup) — $25 |
| Create app "Rasoi APP" | Manual | Play Console → Create app |
| Store listing text | **Yes** | MCP `play_push_listing` or `play_full_setup` |
| Subscriptions `rasoi_plus_monthly` / `rasoi_plus_yearly` | **Yes** | MCP `play_create_rasoi_subscriptions` |
| Screenshots / feature graphic | Manual upload | Generate via `rasoi_mobile/screenshots` |
| Upload AAB | EAS | `eas build -p android --profile production` |

## Quick start

```bash
# 1. Preview bootstrap checklist
chmod +x rasoi_mobile/scripts/play-console-bootstrap.sh
./rasoi_mobile/scripts/play-console-bootstrap.sh

# 2. After Play Console app exists + service account configured:
#    Cursor MCP → play_full_setup
```

## Manual Play Console checklist

### Create developer account
1. [play.google.com/console/signup](https://play.google.com/console/signup)
2. Developer name: **Bhagihiri Applications**
3. Complete identity + $25 registration

### Create application
| Field | Value |
|-------|-------|
| App name | Rasoi APP |
| Default language | English (United States) |
| App or game | App |
| Free or paid | Free |
| Package name | `com.bhagihiri.rasoiapp` |
| Category | Food & Drink |

### Declarations (from code)
- **Ads:** Yes — AdMob (`ca-app-pub-4173581536398147~9898362276`)
- **In-app purchases:** Yes — Rasoi Plus subscriptions
- **Location:** Optional — city for recipes & sponsor analytics
- **Play App Signing:** Accept

### Store listing (copy-paste or use `play_push_listing`)

See `manifest.json` → `storeListing`. Key fields:

- **Title:** Rasoi APP
- **Short:** Aaj kya banaye? Cook from your pantry. 1,200+ Indian recipes. 15 cuisines.
- **Website:** https://rasoiapplication.in
- **Email:** cooking@rasoiapplication.in
- **Privacy:** https://rasoiapplication.in/privacy

### Subscriptions (from `constants/payments.ts` + `constants/plans.ts`)

| Product ID | Price | Period | Base plan ID |
|------------|-------|--------|--------------|
| `rasoi_plus_monthly` | ₹49 | P1M | `monthly` |
| `rasoi_plus_yearly` | ₹499 | P1Y | `yearly` |

RevenueCat mapping:
- Entitlement: `rasoi_plus`
- `$rc_monthly` → `rasoi_plus_monthly`
- `$rc_annual` → `rasoi_plus_yearly`

**Note:** The app’s 3-day trial is **in-app** (`TRIAL_DURATION_DAYS` in `plans.ts`), not a Play subscription free trial.

### Content rating
Answer questionnaire per `manifest.json` → `contentRatingQuestionnaire` (general audience cooking app).

### Build & upload
```bash
cd rasoi_mobile
eas build -p android --profile production
eas submit -p android --profile production
```

## MCP automation

Configure `.cursor/mcp-servers/google-play/` (see README), then:

```
play_get_manifest      → review all fields
play_verify_app        → confirm app exists
play_push_listing      → title + descriptions
play_create_rasoi_subscriptions → ₹49/mo + ₹499/yr
play_full_setup        → all of the above
```

## Code references

| Feature | File |
|---------|------|
| Package & version | `app.json` |
| Subscription IDs | `constants/payments.ts` |
| Prices & trial | `constants/plans.ts` |
| RevenueCat | `constants/revenuecat.ts` |
| Paywall UI | `components/paywall/` |
| Plus features | `PAID_PLAN_FEATURES` in `plans.ts` |
| Legal URLs | `rasoi_backend/src/lib/legal-content.ts` |
