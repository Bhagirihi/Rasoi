import { randomUUID } from 'crypto';

import { createSupabaseAdmin } from '@/lib/supabase-admin';

export const RASOI_SCHEMA = 'rasoi';

export function rasoiDb() {
  return createSupabaseAdmin().schema(RASOI_SCHEMA);
}

/** Prisma used cuid(); UUID is fine for new rows via Supabase admin client. */
export function createRowId(): string {
  return randomUUID();
}
