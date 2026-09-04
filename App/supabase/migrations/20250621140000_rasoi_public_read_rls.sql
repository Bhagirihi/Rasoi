-- Phase 1: mobile direct reads from rasoi schema (catalog tables only).
-- Prisma/backend uses postgres/service role and bypasses RLS.

REVOKE SELECT ON ALL TABLES IN SCHEMA rasoi FROM anon, authenticated;

GRANT USAGE ON SCHEMA rasoi TO anon, authenticated;

GRANT SELECT ON TABLE rasoi."Recipe" TO anon, authenticated;
GRANT SELECT ON TABLE rasoi."KitchenStyle" TO anon, authenticated;
GRANT SELECT ON TABLE rasoi."RegionalCuisineOption" TO anon, authenticated;
GRANT SELECT ON TABLE rasoi."PantrySection" TO anon, authenticated;
GRANT SELECT ON TABLE rasoi."PartnerLink" TO anon, authenticated;
GRANT SELECT ON TABLE rasoi."Sponsor" TO anon, authenticated;
GRANT SELECT ON TABLE rasoi."AppSettings" TO anon, authenticated;

ALTER TABLE rasoi."Recipe" ENABLE ROW LEVEL SECURITY;
ALTER TABLE rasoi."KitchenStyle" ENABLE ROW LEVEL SECURITY;
ALTER TABLE rasoi."RegionalCuisineOption" ENABLE ROW LEVEL SECURITY;
ALTER TABLE rasoi."PantrySection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE rasoi."PartnerLink" ENABLE ROW LEVEL SECURITY;
ALTER TABLE rasoi."Sponsor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE rasoi."AppSettings" ENABLE ROW LEVEL SECURITY;

ALTER TABLE rasoi."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE rasoi."Admin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE rasoi."PushToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE rasoi."AffiliateEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE rasoi."SponsorEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE rasoi."MealNotificationLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE rasoi."UserFeedback" ENABLE ROW LEVEL SECURITY;
ALTER TABLE rasoi."SponsorApplication" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mobile_read_published_recipes" ON rasoi."Recipe";
CREATE POLICY "mobile_read_published_recipes"
  ON rasoi."Recipe"
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

DROP POLICY IF EXISTS "mobile_read_active_kitchen_styles" ON rasoi."KitchenStyle";
CREATE POLICY "mobile_read_active_kitchen_styles"
  ON rasoi."KitchenStyle"
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

DROP POLICY IF EXISTS "mobile_read_active_regional_cuisines" ON rasoi."RegionalCuisineOption";
CREATE POLICY "mobile_read_active_regional_cuisines"
  ON rasoi."RegionalCuisineOption"
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

DROP POLICY IF EXISTS "mobile_read_active_pantry_sections" ON rasoi."PantrySection";
CREATE POLICY "mobile_read_active_pantry_sections"
  ON rasoi."PantrySection"
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

DROP POLICY IF EXISTS "mobile_read_active_partner_links" ON rasoi."PartnerLink";
CREATE POLICY "mobile_read_active_partner_links"
  ON rasoi."PartnerLink"
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

DROP POLICY IF EXISTS "mobile_read_active_sponsors" ON rasoi."Sponsor";
CREATE POLICY "mobile_read_active_sponsors"
  ON rasoi."Sponsor"
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

DROP POLICY IF EXISTS "mobile_read_app_settings" ON rasoi."AppSettings";
CREATE POLICY "mobile_read_app_settings"
  ON rasoi."AppSettings"
  FOR SELECT
  TO anon, authenticated
  USING (true);
