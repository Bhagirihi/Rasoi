import { rasoiDb } from '@/lib/db/client';
import { throwIfError } from '@/lib/db/errors';
import { parseRows, getTableMeta } from '@/lib/db/query';

export type UserWithTokens = {
  id: string;
  dietChoice: string;
  regionalCuisine: string;
  favoriteCuisines: string;
  pantryIngredients: string;
  timezone: string;
  pushTokens: { expoPushToken: string }[];
};

/**
 * Users eligible for meal notifications — active push token required.
 * Two-query approach avoids PostgREST nested-filter limitations.
 */
export async function loadEligibleUsers(
  userId?: string,
  adminOverride?: boolean,
): Promise<UserWithTokens[]> {
  let tokenQuery = rasoiDb().from('PushToken').select('userId, expoPushToken').eq('active', true);
  if (userId) tokenQuery = tokenQuery.eq('userId', userId);

  const { data: tokenRows, error: tokenError } = await tokenQuery;
  throwIfError(tokenError, 'loadEligibleUsers.tokens');

  const tokensByUser = new Map<string, { expoPushToken: string }[]>();
  for (const row of tokenRows ?? []) {
    const uid = String((row as { userId: string }).userId);
    const list = tokensByUser.get(uid) ?? [];
    list.push({ expoPushToken: (row as { expoPushToken: string }).expoPushToken });
    tokensByUser.set(uid, list);
  }

  const userIds = [...tokensByUser.keys()];
  if (userIds.length === 0) return [];

  let userQuery = rasoiDb()
    .from('User')
    .select('id, dietChoice, regionalCuisine, favoriteCuisines, pantryIngredients, timezone')
    .in('id', userIds);

  if (!adminOverride) {
    userQuery = userQuery
      .eq('isActive', true)
      .eq('notificationsEnabled', true)
      .eq('isGuest', false)
      .eq('hasCompletedOnboarding', true);
  }

  if (userId) {
    userQuery = userQuery.eq('id', userId);
  }

  const { data: userRows, error: userError } = await userQuery;
  throwIfError(userError, 'loadEligibleUsers.users');

  const userMeta = getTableMeta('User');
  const users = parseRows<Record<string, unknown>>(userRows, userMeta);

  return users.map((user) => ({
    id: String(user.id),
    dietChoice: String(user.dietChoice),
    regionalCuisine: String(user.regionalCuisine),
    favoriteCuisines: String(user.favoriteCuisines),
    pantryIngredients: String(user.pantryIngredients),
    timezone: String(user.timezone),
    pushTokens: tokensByUser.get(String(user.id)) ?? [],
  }));
}
