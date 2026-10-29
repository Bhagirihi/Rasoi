-- Mirror of rasoi_mobile/supabase/migrations/20250621190000_promo_codes.sql
-- Apply via Supabase migration; this file is reference-only for backend operators.

ALTER TABLE rasoi."User"
  ADD COLUMN IF NOT EXISTS "trialBonusDays" integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "yearlyPromoOfferTag" text;

CREATE TABLE IF NOT EXISTS rasoi."PromoCode" (
  id text PRIMARY KEY,
  code text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('trial_extend', 'yearly_discount')),
  "trialExtendDays" integer,
  "playOfferTag" text,
  "maxRedemptions" integer NOT NULL DEFAULT 10000,
  "redemptionCount" integer NOT NULL DEFAULT 0,
  "expiresAt" timestamptz,
  active boolean NOT NULL DEFAULT true,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "PromoCode_code_key" UNIQUE (code),
  CONSTRAINT "PromoCode_trial_extend_days_check"
    CHECK (
      (kind = 'trial_extend' AND "trialExtendDays" IS NOT NULL AND "trialExtendDays" > 0)
      OR (kind = 'yearly_discount' AND "playOfferTag" IS NOT NULL)
    )
);

CREATE TABLE IF NOT EXISTS rasoi."PromoRedemption" (
  id text PRIMARY KEY,
  "userId" text NOT NULL REFERENCES rasoi."User"(id) ON DELETE CASCADE,
  "promoCodeId" text NOT NULL REFERENCES rasoi."PromoCode"(id) ON DELETE CASCADE,
  "redeemedAt" timestamptz NOT NULL DEFAULT now(),
  "consumedAt" timestamptz,
  CONSTRAINT "PromoRedemption_userId_promoCodeId_key" UNIQUE ("userId", "promoCodeId")
);

-- Seed: MK7Q4VN2 (+5 trial), RT9H6WP8 (+10 trial), JX5L3KC7 (yearly promo-yearly-5)
-- Also run: cd rasoi_backend && npm run db:seed (ensurePromoCodes)
