# Supabase + Rasoi backend layout

This project stores **admin/API data** in the PostgreSQL schema `rasoi`. The backend reads/writes via `@/lib/db` (Supabase admin client on the `rasoi` schema + `pg` for raw SQL).

If you previously ran `004/supabase/migrations/20250610120000_rasoi_schema.sql` in the Supabase SQL editor, those tables live in `public` (`profiles`, `recipes`, etc.) and link to `auth.users`. The backend does **not** manage those legacy tables directly.

| Layer | Schema | Used by |
|-------|--------|---------|
| Rasoi admin + mobile API | `rasoi` | Backend `db` layer + mobile Supabase client — **source of truth** |
| Supabase Auth starter SQL (004) | `public` + `auth` | Optional legacy tables |

Schema DDL is versioned in `rasoi_mobile/supabase/migrations/`. Apply migrations to Supabase before seeding.

### Where to look in Supabase Table Editor

- **Admin saves go to** `rasoi` → `Recipe` (camelCase table name).
- If you also ran `004/supabase/migrations/*.sql`, you will see **`public.recipes`** (snake_case columns). That is a **copy** for the old 004 layout.
- Saving a recipe from `/admin` **syncs** `rasoi.Recipe` → `public.recipes` automatically.
- One-time backfill: `npm run db:sync-public`

## Realtime (admin auto-refresh)

The admin console subscribes to Supabase Realtime on the `rasoi` schema. After schema migrations, run once:

```bash
npm run db:realtime
```

Or paste `prisma/supabase-realtime.sql` into the Supabase SQL editor. This adds `rasoi` tables to the `supabase_realtime` publication and grants `SELECT` to `anon`/`authenticated` for private-schema listening.

## Seed

```bash
npm run db:seed
```

Seeds admin account, kitchen-style recipes, sponsors, partners, and reference data into `rasoi.*`.
