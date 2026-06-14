# Supabase + Prisma layout

This project stores **admin/API data** in the PostgreSQL schema `rasoi` (managed by Prisma).

If you previously ran `004/supabase/migrations/20250610120000_rasoi_schema.sql` in the Supabase SQL editor, those tables live in `public` (`profiles`, `recipes`, etc.) and link to `auth.users`. Prisma does **not** manage those tables.

| Layer | Schema | Used by |
|-------|--------|---------|
| Rasoi admin + mobile API (005) | `rasoi` | Prisma `db:sync` — **source of truth** |
| Supabase Auth starter SQL (004) | `public` + `auth` | Optional legacy tables |

Running `npm run db:sync` only creates/updates tables under `rasoi`.

### Where to look in Supabase Table Editor

- **Admin saves go to** `rasoi` → `Recipe` (camelCase table name).
- If you also ran `004/supabase/migrations/*.sql`, you will see **`public.recipes`** (snake_case columns). That is a **copy** for the old 004 layout.
- Saving a recipe from `/admin` now **syncs** `rasoi.Recipe` → `public.recipes` automatically.
- One-time backfill: `npm run db:sync-public`

## Realtime (admin auto-refresh)

The admin console subscribes to Supabase Realtime on the `rasoi` schema. After the first `db:sync`, run once:

```bash
npm run db:realtime
```

Or paste `prisma/supabase-realtime.sql` into the Supabase SQL editor. This adds `rasoi` tables to the `supabase_realtime` publication and grants `SELECT` to `anon`/`authenticated` for private-schema listening.
