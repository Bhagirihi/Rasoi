-- One-time setup: Supabase Vault secrets for pg_cron → Rasoi API cron routes.
-- Run in Supabase SQL Editor (Dashboard → SQL → New query).
--
-- Use the SAME values as production:
--   rasoi_api_base_url  → https://rasoiapplication.in (no trailing slash)
--   rasoi_cron_secret   → Vercel env CRON_SECRET
--
-- If secrets already exist, delete them first in Dashboard → Database → Vault,
-- or skip the lines that fail with duplicate name.

SELECT vault.create_secret(
  'https://rasoiapplication.in',
  'rasoi_api_base_url',
  'Rasoi production API base URL for pg_cron HTTP calls'
);

-- Replace the placeholder below with your real CRON_SECRET from Vercel:
SELECT vault.create_secret(
  'REPLACE_WITH_VERCEL_CRON_SECRET',
  'rasoi_cron_secret',
  'Bearer token for /api/cron/* routes'
);

-- Verify (shows names only, not values):
SELECT name, description FROM vault.secrets WHERE name LIKE 'rasoi_%';

-- Optional manual test (returns pg_net request_id when secrets are set):
-- SELECT rasoi_cron.invoke_meal_notifications();
