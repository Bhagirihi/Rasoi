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

/**
 * Public catalog reads (recipes, reference, sponsors).
 * Set EXPO_PUBLIC_DIRECT_SUPABASE_CATALOG=0 to route through rasoiapplication.in API and cut Supabase egress.
 * User profile / push-token writes still use direct Supabase when reads are enabled.
 */
export function isDirectSupabaseCatalogEnabled(): boolean {
  if (process.env.EXPO_PUBLIC_DIRECT_SUPABASE_CATALOG === '0') {
    return false;
  }
  return isDirectSupabaseReadsEnabled();
}

export function isSupabaseDirectMode(): boolean {
  return isDirectSupabaseReadsEnabled();
}
