-- Apply in Supabase SQL editor or via db:push
ALTER TABLE rasoi."User"
  ADD COLUMN IF NOT EXISTS "termsAcceptedVersion" TEXT;

CREATE TABLE IF NOT EXISTS rasoi."ProcessedWebhookEvent" (
  "eventId" TEXT NOT NULL,
  "source" TEXT NOT NULL DEFAULT 'revenuecat',
  "eventType" TEXT NOT NULL,
  "userId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProcessedWebhookEvent_pkey" PRIMARY KEY ("eventId")
);

CREATE INDEX IF NOT EXISTS "ProcessedWebhookEvent_userId_createdAt_idx"
  ON rasoi."ProcessedWebhookEvent" ("userId", "createdAt" DESC);
