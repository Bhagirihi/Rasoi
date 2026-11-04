-- Cooking streak: one row per user per cooked day.
--
-- UserRecipeCooked upserts per user+recipe, so it cannot tell whether the
-- same recipe was cooked on consecutive days — CookDay is the streak source
-- of truth. TEXT day keys ('YYYY-MM-DD', same convention as
-- MealNotificationLog.dayKey) so the DAL needs no date conversion.
--
-- NOTE: unapplied — apply to live Supabase before this feature can record
-- streaks. Until then the cooked route's CookDay write will fail (the
-- existing UserRecipeCooked log still succeeds first).

CREATE TABLE IF NOT EXISTS rasoi."CookDay" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES rasoi."User"(id) ON DELETE CASCADE,
  "dayKey" TEXT NOT NULL,
  "cookedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE ("userId", "dayKey")
);
CREATE INDEX IF NOT EXISTS "CookDay_userId_idx" ON rasoi."CookDay" ("userId");
