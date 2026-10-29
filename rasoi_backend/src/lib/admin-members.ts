import type { AdminUserRow } from '@/app/admin/_components/admin-users-types';
import { formatPlanTierLabel } from '@/app/admin/_components/admin-users-types';
import { DIET_CHOICE_LABELS, type DietChoice } from '@/lib/recipe-filters';
import { listSupabaseAuthUsers } from '@/lib/supabase-auth-users';
import { db } from '@/lib/db';
import { queryPg } from '@/lib/db/pg';
import type { UserWithRelations } from '@/lib/db/types';
import { serializeUserPlan } from '@/lib/plan-serializer';
import { serializeUser } from '@/lib/serializers';

export function toAdminUserRow(
  user: UserWithRelations & { _count?: { pushTokens: number } },
): AdminUserRow {
  const serialized = serializeUser(user);
  const plan = serializeUserPlan(user);
  const dietLabel =
    DIET_CHOICE_LABELS[serialized.dietChoice as DietChoice] ?? serialized.dietChoice;
  const pushTokenCount = user._count?.pushTokens ?? 0;
  const ineligibleReasons: string[] = [];

  if (serialized.isGuest) ineligibleReasons.push('Guest account');
  if (!serialized.isActive) ineligibleReasons.push('Account deactivated');
  if (!serialized.hasCompletedOnboarding) ineligibleReasons.push('Onboarding incomplete');
  if (!serialized.notificationsEnabled) ineligibleReasons.push('Notifications disabled');
  if (pushTokenCount === 0) ineligibleReasons.push('No active push token');

  return {
    id: serialized.id,
    supabaseUserId: user.supabaseUserId ?? null,
    syncStatus: 'synced',
    name: serialized.name,
    email: serialized.email,
    phone: serialized.phone,
    dietLabel,
    regionalCuisine: serialized.regionalCuisine,
    favoriteCuisines: serialized.favoriteCuisines,
    isGuest: serialized.isGuest,
    isActive: serialized.isActive,
    planTier: plan.planTier,
    planLabel: formatPlanTierLabel(plan.planTier),
    trialStartedAt: plan.trialStartedAt,
    trialBonusDays: plan.trialBonusDays,
    trialTotalDays: plan.trialTotalDays,
    trialActive: plan.trialActive,
    hasCompletedOnboarding: serialized.hasCompletedOnboarding,
    notificationsEnabled: serialized.notificationsEnabled,
    pushTokenCount,
    timezone: user.timezone || 'Asia/Kolkata',
    city: user.city ?? null,
    state: user.state ?? null,
    latitude: user.latitude ?? null,
    longitude: user.longitude ?? null,
    locationUpdatedAt: user.locationUpdatedAt?.toISOString() ?? null,
    termsAcceptedAt: user.termsAcceptedAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
    accountLabel: serialized.isGuest ? 'Guest session' : 'Registered member',
    ineligibleReasons,
    canManage: true,
  };
}

function authOnlyRow(auth: Awaited<ReturnType<typeof listSupabaseAuthUsers>>[number]): AdminUserRow {
  return {
    id: `auth:${auth.id}`,
    supabaseUserId: auth.id,
    syncStatus: 'auth_only',
    name: auth.name,
    email: auth.email,
    phone: auth.phone,
    dietLabel: '—',
    regionalCuisine: '—',
    favoriteCuisines: [],
    isGuest: auth.isAnonymous,
    isActive: true,
    planTier: 'free',
    planLabel: 'Not synced',
    trialStartedAt: null,
    trialBonusDays: 0,
    trialTotalDays: 0,
    trialActive: false,
    hasCompletedOnboarding: false,
    notificationsEnabled: false,
    pushTokenCount: 0,
    timezone: '—',
    city: null,
    state: null,
    latitude: null,
    longitude: null,
    locationUpdatedAt: null,
    termsAcceptedAt: null,
    createdAt: auth.createdAt,
    accountLabel: auth.isAnonymous ? 'Supabase anonymous' : 'Supabase auth only',
    ineligibleReasons: ['App profile not created — user has not completed Rasoi sync'],
    canManage: false,
    lastSignInAt: auth.lastSignInAt,
  };
}

export async function loadRasoiUsersWithPushCounts(
  where: Record<string, unknown>,
  options?: { take?: number; skip?: number },
): Promise<UserWithRelations[]> {
  const users = await db.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: options?.take,
    skip: options?.skip,
  });

  if (users.length === 0) return [];

  const userIds = users.map((user) => user.id);
  const tokens = await db.pushToken.findMany({
    where: { userId: { in: userIds }, active: true },
    select: { userId: true },
  });

  const countByUser = new Map<string, number>();
  for (const token of tokens) {
    countByUser.set(token.userId, (countByUser.get(token.userId) ?? 0) + 1);
  }

  return users.map((user) => ({
    ...user,
    _count: { pushTokens: countByUser.get(user.id) ?? 0 },
  }));
}

/** Merge rasoi.User rows with Supabase Auth users (service role API).
 *
 * Pagination happens in the database, not in JS. The rasoi page is fetched
 * with an expanded window that provably contains every rasoi row of the
 * merged page: a rasoi row at merged position p has rasoi-rank in
 * [p - authOnlyCount, p], so fetching rasoi ranks
 * [max(0, skip - authOnlyCount), skip + take) plus all auth-only rows,
 * then sorting and slicing, yields the exact page. The window is
 * pageSize + authOnlyCount rows instead of the whole User table.
 * Totals come from COUNT queries, not from fetched rows.
 * The auth-only diff uses a narrow two-column query (not full User rows),
 * and the auth list itself is cached (see listSupabaseAuthUsers).
 * If the linked-ids query fails, auth-only rows are hidden rather than
 * guessed — a failed diff must never duplicate synced users as auth-only.
 */
export async function loadAdminMemberRows(
  where: Record<string, unknown>,
  options?: { includeAuthOnly?: boolean; take?: number; skip?: number },
): Promise<{ rows: AdminUserRow[]; total: number }> {
  const includeAuthOnly = options?.includeAuthOnly ?? true;
  const skip = options?.skip ?? 0;
  const take = options?.take;

  const [authUsers, linked] = await Promise.all([
    includeAuthOnly ? listSupabaseAuthUsers().catch(() => []) : Promise.resolve([]),
    includeAuthOnly
      ? queryPg<{ supabaseUserId: string | null; email: string | null }>(
          'SELECT "supabaseUserId", email FROM rasoi."User"',
        ).catch(() => null)
      : Promise.resolve([]),
  ]);

  const linkedSupabaseIds = new Set(
    (linked ?? [])
      .map((row) => row.supabaseUserId)
      .filter((id): id is string => Boolean(id)),
  );
  const linkedEmails = new Set(
    (linked ?? [])
      .map((row) => row.email?.toLowerCase())
      .filter((email): email is string => Boolean(email)),
  );

  const authOnlyRows =
    linked === null
      ? []
      : authUsers
          .filter((auth) => !linkedSupabaseIds.has(auth.id))
          .filter((auth) => !auth.email || !linkedEmails.has(auth.email.toLowerCase()))
          .map(authOnlyRow);

  if (take == null) {
    // Unpaginated caller: previous behaviour (whole table, merged, sorted).
    const rasoiUsers = await loadRasoiUsersWithPushCounts(where);
    const allRows = [...authOnlyRows, ...rasoiUsers.map(toAdminUserRow)].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return { rows: allRows.slice(skip), total: allRows.length };
  }

  const authCount = authOnlyRows.length;
  // Rasoi rows that can appear in merged window [skip, skip + take) have
  // rasoi-rank in [skip - authCount, skip + take).
  const windowSkip = Math.max(0, skip - authCount);
  const windowTake = skip + take - windowSkip;

  const [rasoiUsers, rasoiTotal] = await Promise.all([
    loadRasoiUsersWithPushCounts(where, { take: windowTake, skip: windowSkip }),
    db.user.count({ where }),
  ]);

  const merged = [...authOnlyRows, ...rasoiUsers.map(toAdminUserRow)].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  // Every rasoi row ranked below windowSkip sorts before the window, so the
  // window starts at local index skip - windowSkip.
  const pageStart = skip - windowSkip;
  return { rows: merged.slice(pageStart, pageStart + take), total: rasoiTotal + authCount };
}

