-- Run once on Supabase if db push is not used from CI.
CREATE TABLE IF NOT EXISTS rasoi."UserFeedback" (
  id TEXT PRIMARY KEY,
  "userId" TEXT,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  name TEXT,
  email TEXT,
  "appVersion" TEXT,
  platform TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "UserFeedback_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES rasoi."User"(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "UserFeedback_status_createdAt_idx"
  ON rasoi."UserFeedback" (status, "createdAt" DESC);
