-- Backend-controlled home announcements (modal / banner / both).

CREATE TABLE IF NOT EXISTS rasoi."HomeAnnouncement" (
  id text PRIMARY KEY,
  "campaignKey" text NOT NULL UNIQUE,
  enabled boolean NOT NULL DEFAULT false,
  title text NOT NULL,
  body text NOT NULL,
  "imageUrl" text,
  "ctaLabel" text,
  "ctaLink" text,
  presentation text NOT NULL DEFAULT 'both',
  "startsAt" timestamptz,
  "endsAt" timestamptz,
  "minAppVersion" text,
  audience text NOT NULL DEFAULT 'all',
  "sortOrder" integer NOT NULL DEFAULT 0,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS home_announcement_active_idx
  ON rasoi."HomeAnnouncement" (enabled, "sortOrder" DESC, "createdAt" DESC);
