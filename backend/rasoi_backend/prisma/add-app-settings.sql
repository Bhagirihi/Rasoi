-- Run once on Supabase if db push is not used from CI.
CREATE TABLE IF NOT EXISTS rasoi."AppSettings" (
  id TEXT PRIMARY KEY DEFAULT 'default',
  "paymentsEnabled" BOOLEAN NOT NULL DEFAULT false,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO rasoi."AppSettings" (id, "paymentsEnabled")
VALUES ('default', false)
ON CONFLICT (id) DO NOTHING;
