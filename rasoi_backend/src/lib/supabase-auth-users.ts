import type { User as SupabaseAuthUser } from '@supabase/supabase-js';

import { createSupabaseAdmin } from '@/lib/supabase-admin';

export type ListedAuthUser = {
  id: string;
  email: string | null;
  phone: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  isAnonymous: boolean;
  name: string;
};

function authDisplayName(user: SupabaseAuthUser): string {
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const metaName = typeof meta?.name === 'string' ? meta.name.trim() : '';
  if (metaName.length >= 2) return metaName;
  if (user.email) return user.email.split('@')[0] ?? 'Auth user';
  return user.is_anonymous ? 'Anonymous guest' : 'Auth user';
}

export function isAnonymousAuthUser(user: SupabaseAuthUser): boolean {
  if (user.is_anonymous === true) return true;
  const provider = user.app_metadata?.provider;
  return provider === 'anonymous';
}

export async function getSupabaseAuthUserById(
  supabaseUserId: string,
): Promise<ListedAuthUser | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.auth.admin.getUserById(supabaseUserId);
  if (error || !data.user) return null;

  const user = data.user;
  return {
    id: user.id,
    email: user.email ?? null,
    phone: user.phone ?? null,
    createdAt: user.created_at,
    lastSignInAt: user.last_sign_in_at ?? null,
    isAnonymous: isAnonymousAuthUser(user),
    name: authDisplayName(user),
  };
}

const AUTH_LIST_TTL_MS = 5 * 60 * 1000;

let cachedAuthUsers: { at: number; users: ListedAuthUser[] } | null = null;

export async function listSupabaseAuthUsers(maxPages = 20): Promise<ListedAuthUser[]> {
  // The auth list changes slowly (a new signup, a completed sync) but is
  // fetched on every unfiltered /admin/users page view. Cache it briefly.
  // Module-level cache: per serverless instance, so a cold instance still
  // pays one full listing — acceptable for an admin page.
  if (cachedAuthUsers && Date.now() - cachedAuthUsers.at < AUTH_LIST_TTL_MS) {
    return cachedAuthUsers.users;
  }

  const supabase = createSupabaseAdmin();
  const collected: ListedAuthUser[] = [];
  const perPage = 1000;

  for (let page = 1; page <= maxPages; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw new Error(`Supabase auth listUsers failed: ${error.message}`);
    }

    for (const user of data.users) {
      collected.push({
        id: user.id,
        email: user.email ?? null,
        phone: user.phone ?? null,
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at ?? null,
        isAnonymous: isAnonymousAuthUser(user),
        name: authDisplayName(user),
      });
    }

    if (data.users.length < perPage) break;
  }

  const sorted = collected.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  // Only cache successful listings; a failed listing must not poison the cache.
  cachedAuthUsers = { at: Date.now(), users: sorted };
  return sorted;
}

