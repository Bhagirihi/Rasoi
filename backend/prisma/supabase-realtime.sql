-- Enable Supabase Realtime for Prisma tables in the `rasoi` schema.
-- Run once in Supabase SQL editor, or: npm run db:realtime

-- Realtime reads changes from this publication.
ALTER PUBLICATION supabase_realtime ADD TABLES IN SCHEMA rasoi;

-- Private schemas need SELECT grants for the anon/authenticated roles (publishable key).
GRANT USAGE ON SCHEMA rasoi TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA rasoi TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA rasoi GRANT SELECT ON TABLES TO anon, authenticated;
