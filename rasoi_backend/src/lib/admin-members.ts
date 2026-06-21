import type { AdminUserRow } from '@/app/admin/_components/admin-users-types';
import { formatPlanTierLabel } from '@/app/admin/_components/admin-users-types';
import { DIET_CHOICE_LABELS, type DietChoice } from '@/lib/recipe-filters';
import { listSupabaseAuthUsers } from '@/lib/supabase-auth-users';
import { db } from '@/lib/db';
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
  take = 500,
): Promise<UserWithRelations[]> {
  const users = await db.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take,
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

/** Merge rasoi.User rows with Supabase Auth users (service role API). */
export async function loadAdminMemberRows(
  where: Record<string, unknown>,
  options?: { includeAuthOnly?: boolean },
): Promise<AdminUserRow[]> {
  const includeAuthOnly = options?.includeAuthOnly ?? true;

  const [rasoiUsers, authUsers] = await Promise.all([
    loadRasoiUsersWithPushCounts(where),
    includeAuthOnly ? listSupabaseAuthUsers().catch(() => []) : Promise.resolve([]),
  ]);

  const syncedRows = rasoiUsers.map(toAdminUserRow);
  const linkedSupabaseIds = new Set(
    syncedRows.map((row) => row.supabaseUserId).filter((id): id is string => Boolean(id)),
  );
  const linkedEmails = new Set(
    syncedRows.map((row) => row.email?.toLowerCase()).filter((email): email is string => Boolean(email)),
  );

  const authOnlyRows = authUsers
    .filter((auth) => !linkedSupabaseIds.has(auth.id))
    .filter((auth) => !auth.email || !linkedEmails.has(auth.email.toLowerCase()))
    .map(authOnlyRow);

  return [...syncedRows, ...authOnlyRows].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
