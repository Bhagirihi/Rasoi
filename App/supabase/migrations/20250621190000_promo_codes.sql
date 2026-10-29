-- Rasoi Plus promo codes: in-app trial extensions + yearly Play offer unlock.

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

CREATE INDEX IF NOT EXISTS "PromoRedemption_userId_redeemedAt_idx"
  ON rasoi."PromoRedemption" ("userId", "redeemedAt" DESC);

-- Protect promo-related columns from direct mobile writes (same as plan fields).
CREATE OR REPLACE FUNCTION rasoi.protect_user_sensitive_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  jwt_role text;
BEGIN
  jwt_role := auth.jwt() ->> 'role';

  IF jwt_role IS NULL OR jwt_role = 'service_role' THEN
    RETURN NEW;
  END IF;

  NEW."planTier" := OLD."planTier";
  NEW."trialStartedAt" := OLD."trialStartedAt";
  NEW."hasUsedTrial" := OLD."hasUsedTrial";
  NEW."trialBonusDays" := OLD."trialBonusDays";
  NEW."yearlyPromoOfferTag" := OLD."yearlyPromoOfferTag";
  NEW."role" := OLD."role";
  NEW."isActive" := OLD."isActive";
  NEW."isGuest" := OLD."isGuest";
  NEW."email" := OLD."email";
  NEW."supabaseUserId" := OLD."supabaseUserId";
  NEW."termsAcceptedAt" := OLD."termsAcceptedAt";
  NEW."termsAcceptedVersion" := OLD."termsAcceptedVersion";
  NEW."createdAt" := OLD."createdAt";

  RETURN NEW;
END;
$$;

-- Seed launch codes (unique, non-guessable). Rotate in admin if leaked.
INSERT INTO rasoi."PromoCode" (
  id, code, kind, "trialExtendDays", "playOfferTag", "maxRedemptions", active
) VALUES
  (
    'promo_trial_extend_5',
    'MK7Q4VN2',
    'trial_extend',
    5,
    NULL,
    10000,
    true
  ),
  (
    'promo_trial_extend_10',
    'RT9H6WP8',
    'trial_extend',
    10,
    NULL,
    10000,
    true
  ),
  (
    'promo_yearly_discount_5',
    'JX5L3KC7',
    'yearly_discount',
    NULL,
    'promo-yearly-5',
    10000,
    true
  )
ON CONFLICT (id) DO NOTHING;
