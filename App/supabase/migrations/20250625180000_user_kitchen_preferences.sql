-- Kitchen preferences: allergies, household size, free-tier partner shop quota.
ALTER TABLE rasoi."User"
  ADD COLUMN IF NOT EXISTS "kitchenPreferences" text NOT NULL DEFAULT '{}';
