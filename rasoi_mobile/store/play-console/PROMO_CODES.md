# Rasoi Plus promo codes

**Do not commit live codes.** This file is a template only — real codes live in
`rasoi."PromoCode"` (Supabase) and are shared privately with users/influencers.
(The launch codes were previously committed here by mistake; they have been
removed and should be rotated in Supabase.)

## Launch codes (seeded in Supabase)

| Code | Effect | Who can redeem |
|------|--------|----------------|
| `<TRIAL_5D_CODE>` | +5 days on in-app trial | Active trial only |
| `<TRIAL_10D_CODE>` | +10 days on in-app trial | Active trial only |
| `<YEARLY_5PCT_CODE>` | 5% off yearly Rasoi Plus | Not already on paid plan |

Trial codes extend `trialBonusDays` on the server. Yearly code sets `yearlyPromoOfferTag` → Play offer `promo-yearly-5`.

## Google Play Console (yearly discount)

Create once on `rasoi_plus_yearly` → base plan `yearly`:

1. **Add offer** → Offer ID: `yearly-promo-5pct`
2. **Eligibility:** Developer determined
3. **Tags:** `promo-yearly-5`, `rc-ignore-offer`
4. **Phase 1:** Percentage discount **5%** on first billing period (India ₹499 → ₹474)

Until this offer exists in Play Console, the yearly promo code unlocks in-app UI but checkout may fall back to full price.

## Rotate codes

Update rows in `rasoi."PromoCode"` (deactivate old, insert new). Codes are case-insensitive at redeem.

## API

`POST /api/users/me/promo/redeem` — body `{ "code": "<TRIAL_5D_CODE>" }`, requires auth + payments enabled.
