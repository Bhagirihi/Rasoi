-- Restore Recipe columns required by mobile + backend after accidental drop.
-- Backfill from schema v2 columns (image_url, method, cuisine, diet, main_ingredients).
-- Harden RPC execute grants and lock down tables exposed without RLS.

-- ---------------------------------------------------------------------------
-- 1. Restore Recipe app columns
-- ---------------------------------------------------------------------------
ALTER TABLE rasoi."Recipe"
  ADD COLUMN IF NOT EXISTS "kitchenStyleId" text,
  ADD COLUMN IF NOT EXISTS "kitchenStyleIds" text,
  ADD COLUMN IF NOT EXISTS "dietType" text,
  ADD COLUMN IF NOT EXISTS difficulty text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS "imageUrl" text,
  ADD COLUMN IF NOT EXISTS tags text,
  ADD COLUMN IF NOT EXISTS steps text,
  ADD COLUMN IF NOT EXISTS "descriptionHi" text,
  ADD COLUMN IF NOT EXISTS "stepsHi" text,
  ADD COLUMN IF NOT EXISTS "primaryIngredient" text,
  ADD COLUMN IF NOT EXISTS "popularityScore" integer NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS "qualityScore" integer NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS "sourceUrl" text,
  ADD COLUMN IF NOT EXISTS "sourceSite" text,
  ADD COLUMN IF NOT EXISTS "scrapedAt" timestamptz;

UPDATE rasoi."Recipe"
SET
  "imageUrl" = COALESCE("imageUrl", image_url, ''),
  steps = COALESCE(steps, method),
  "kitchenStyleId" = COALESCE("kitchenStyleId", cuisine, 'north'),
  "kitchenStyleIds" = COALESCE(
    "kitchenStyleIds",
    json_build_array(COALESCE(cuisine, 'north'))::text,
    '[]'
  ),
  "dietType" = COALESCE("dietType", diet, 'Veg'),
  description = COALESCE(
    NULLIF(trim(description), ''),
    NULLIF(trim(main_ingredients), ''),
    title
  ),
  difficulty = COALESCE(
    difficulty,
    CASE
      WHEN "prepTime" <= 20 THEN 'Easy'
      WHEN "prepTime" <= 45 THEN 'Medium'
      ELSE 'Hard'
    END
  ),
  tags = COALESCE(NULLIF(trim(tags), ''), '[]'),
  "popularityScore" = COALESCE("popularityScore", 50),
  "qualityScore" = COALESCE("qualityScore", 50);

UPDATE rasoi."Recipe"
SET "primaryIngredient" = CASE
  WHEN lower(title) LIKE '%paneer%' THEN 'paneer'
  WHEN lower(title) LIKE '%chicken%' THEN 'chicken'
  WHEN lower(title) LIKE '%mutton%' OR lower(title) LIKE '%gosht%' THEN 'mutton'
  WHEN lower(title) LIKE '%fish%' OR lower(title) LIKE '%machhi%' THEN 'fish'
  WHEN lower(title) LIKE '%egg%' OR lower(title) LIKE '%anda%' THEN 'egg'
  WHEN lower(title) LIKE '%aloo%' OR lower(title) LIKE '%potato%' THEN 'aloo'
  WHEN lower(title) LIKE '%dal%' OR lower(title) LIKE '%lentil%' THEN 'dal'
  WHEN lower(title) LIKE '%chole%' OR lower(title) LIKE '%chana%' THEN 'chole'
  WHEN lower(title) LIKE '%rajma%' THEN 'rajma'
  WHEN lower(title) LIKE '%mushroom%' THEN 'mushroom'
  WHEN lower(title) LIKE '%tofu%' THEN 'tofu'
  WHEN lower(title) LIKE '%poha%' THEN 'poha'
  WHEN lower(title) LIKE '%idli%' THEN 'idli'
  WHEN lower(title) LIKE '%dosa%' THEN 'dosa'
  WHEN lower(title) LIKE '%paratha%' THEN 'paratha'
  WHEN lower(title) LIKE '%rice%' OR lower(title) LIKE '%biryani%' OR lower(title) LIKE '%pulao%' THEN 'rice'
  ELSE "primaryIngredient"
END
WHERE "primaryIngredient" IS NULL;

ALTER TABLE rasoi."Recipe"
  ALTER COLUMN "kitchenStyleId" SET DEFAULT 'north',
  ALTER COLUMN "kitchenStyleIds" SET DEFAULT '[]',
  ALTER COLUMN "dietType" SET DEFAULT 'Veg',
  ALTER COLUMN difficulty SET DEFAULT 'Medium',
  ALTER COLUMN description SET DEFAULT '',
  ALTER COLUMN "imageUrl" SET DEFAULT '',
  ALTER COLUMN tags SET DEFAULT '[]';

ALTER TABLE rasoi."Recipe"
  ALTER COLUMN "kitchenStyleId" SET NOT NULL,
  ALTER COLUMN "kitchenStyleIds" SET NOT NULL,
  ALTER COLUMN "dietType" SET NOT NULL,
  ALTER COLUMN difficulty SET NOT NULL,
  ALTER COLUMN description SET NOT NULL,
  ALTER COLUMN "imageUrl" SET NOT NULL,
  ALTER COLUMN tags SET NOT NULL;

CREATE INDEX IF NOT EXISTS "Recipe_kitchenStyleId_idx"
  ON rasoi."Recipe" ("kitchenStyleId");

COMMENT ON COLUMN rasoi."Recipe"."descriptionHi" IS 'Hindi description for recipe detail screen';
COMMENT ON COLUMN rasoi."Recipe"."stepsHi" IS 'JSON array of Hindi cooking steps';

-- ---------------------------------------------------------------------------
-- 2. Lock down sensitive rasoi tables (service_role / backend only)
-- ---------------------------------------------------------------------------
REVOKE ALL ON TABLE rasoi."PromoCode" FROM anon, authenticated;
REVOKE ALL ON TABLE rasoi."PromoRedemption" FROM anon, authenticated;
REVOKE ALL ON TABLE rasoi."HomeAnnouncement" FROM anon, authenticated;
REVOKE ALL ON TABLE rasoi."UserRecommendationCache" FROM anon, authenticated;
REVOKE ALL ON TABLE rasoi."UserRecommendationHistory" FROM anon, authenticated;
REVOKE ALL ON TABLE rasoi."UserRecipeView" FROM anon, authenticated;
REVOKE ALL ON TABLE rasoi."UserRecipeCooked" FROM anon, authenticated;

ALTER TABLE rasoi."PromoCode" ENABLE ROW LEVEL SECURITY;
ALTER TABLE rasoi."PromoRedemption" ENABLE ROW LEVEL SECURITY;
ALTER TABLE rasoi."HomeAnnouncement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE rasoi."UserRecommendationCache" ENABLE ROW LEVEL SECURITY;
ALTER TABLE rasoi."UserRecommendationHistory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE rasoi."UserRecipeView" ENABLE ROW LEVEL SECURITY;
ALTER TABLE rasoi."UserRecipeCooked" ENABLE ROW LEVEL SECURITY;

-- Admin / cron tables: RLS on, no client policies (service_role bypasses RLS).
DROP POLICY IF EXISTS "deny_client_admin" ON rasoi."Admin";
CREATE POLICY "deny_client_admin"
  ON rasoi."Admin"
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "deny_client_meal_notification_log" ON rasoi."MealNotificationLog";
CREATE POLICY "deny_client_meal_notification_log"
  ON rasoi."MealNotificationLog"
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "deny_client_sponsor_application" ON rasoi."SponsorApplication";
CREATE POLICY "deny_client_sponsor_application"
  ON rasoi."SponsorApplication"
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- ---------------------------------------------------------------------------
-- 3. Harden SECURITY DEFINER RPCs (not callable via PostgREST by anon)
-- ---------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.grant_referral_premium(uuid, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.seed_default_pantry_for_user(uuid) FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.apply_referral_code(text) FROM anon;
REVOKE ALL ON FUNCTION public.get_my_referrals() FROM anon;
GRANT EXECUTE ON FUNCTION public.apply_referral_code(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_referrals() TO authenticated;

GRANT EXECUTE ON FUNCTION public.grant_referral_premium(uuid, integer) TO service_role;

-- ---------------------------------------------------------------------------
-- 4. Function search_path hardening
-- ---------------------------------------------------------------------------
ALTER FUNCTION public.set_updated_at() SET search_path = public;
ALTER FUNCTION rasoi.protect_user_sensitive_columns() SET search_path = rasoi, public;
