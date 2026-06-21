import { getSupabaseClient, RASOI_REALTIME_SCHEMA, requireSupabaseClient } from '@/utils/supabase';

export function getRasoiDb() {
  return requireSupabaseClient().schema(RASOI_REALTIME_SCHEMA);
}

/** Phase 1–3: direct Supabase reads/writes when configured (set EXPO_PUBLIC_DIRECT_SUPABASE_READS=0 to disable). */
export function isDirectSupabaseReadsEnabled(): boolean {
  if (process.env.EXPO_PUBLIC_DIRECT_SUPABASE_READS === '0') {
    return false;
  }
  const supabase = getSupabaseClient();
  return supabase !== null;
}

export function isSupabaseDirectMode(): boolean {
  return isDirectSupabaseReadsEnabled();
}
