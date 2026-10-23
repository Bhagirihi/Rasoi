import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';

import { getSecureItem, removeSecureItem, setSecureItem } from '@/utils/secureStorage';
import { createSupabaseDebugFetch } from '@/utils/supabaseDebugFetch';

let client: SupabaseClient | null = null;
/** undefined = not loaded yet; null = no session */
let sessionCache: Session | null | undefined;

function updateSessionCache(session: Session | null): void {
  sessionCache = session;
}

/**
 * Supabase auth storage backed by encrypted SecureStore (chunked, so large
 * sessions fit the Android value-size limit). Legacy AsyncStorage sessions are
 * migrated automatically by secureStorage on first read.
 */
const secureAuthStorage = {
  getItem: (key: string) => getSecureItem(key),
  setItem: (key: string, value: string) => setSecureItem(key, value),
  removeItem: (key: string) => removeSecureItem(key),
};

export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !key) {
    return null;
  }

  if (!client) {
    client = createClient(url, key, {
      auth: {
        storage: secureAuthStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
      global: {
        fetch: createSupabaseDebugFetch(),
      },
    });

    client.auth.onAuthStateChange((_event, session) => {
      updateSessionCache(session);
    });
  }

  return client;
}

export function requireSupabaseClient(): SupabaseClient {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
  }
  return supabase;
}

/** Prime auth storage + session cache before first OTP/login call. */
export function warmSupabaseClient(): void {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  if (sessionCache === undefined) {
    void supabase.auth.getSession().then(({ data }) => {
      updateSessionCache(data.session);
    });
  }
}

export function getSupabaseSessionCache(): Session | null | undefined {
  return sessionCache;
}

export function setSupabaseSessionCache(session: Session | null): void {
  updateSessionCache(session);
}

export function clearSupabaseSessionCache(): void {
  sessionCache = null;
}

export const RASOI_REALTIME_SCHEMA = 'rasoi';
