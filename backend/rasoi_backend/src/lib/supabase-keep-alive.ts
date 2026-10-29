import { queryPg } from '@/lib/db';

export type KeepAliveResult = {
  ok: boolean;
  timestamp: string;
  database: boolean;
  authApi: boolean;
  errors: string[];
};

/**
 * Lightweight pings so Supabase Postgres + API stay active (avoids free-tier pause).
 */
export async function runSupabaseKeepAlive(): Promise<KeepAliveResult> {
  const errors: string[] = [];
  let database = false;
  let authApi = false;

  try {
    await queryPg('SELECT 1 AS ok');
    database = true;
  } catch (error) {
    errors.push(
      `database: ${error instanceof Error ? error.message : 'query failed'}`,
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (supabaseUrl && publishableKey) {
    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
        headers: { apikey: publishableKey },
        cache: 'no-store',
      });
      authApi = response.ok;
      if (!response.ok) {
        errors.push(`auth_api: HTTP ${response.status}`);
      }
    } catch (error) {
      errors.push(
        `auth_api: ${error instanceof Error ? error.message : 'request failed'}`,
      );
    }
  } else {
    errors.push('auth_api: missing NEXT_PUBLIC_SUPABASE_URL or publishable key');
  }

  return {
    ok: database && authApi,
    timestamp: new Date().toISOString(),
    database,
    authApi,
    errors,
  };
}
