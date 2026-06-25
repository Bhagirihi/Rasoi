import { getAutoTrialWriteForNewUser } from '@/lib/auto-trial';
import { getDefaultPantryIngredients } from '@/lib/app-settings';
import { db, queryPg } from '@/lib/db';
import type { Recipe } from '@/lib/db/types';
import {
  getSupabaseAuthUserById,
  listSupabaseAuthUsers,
  type ListedAuthUser,
} from '@/lib/supabase-auth-users';
import { syncPublicKitchenStyle } from '@/lib/sync-public-kitchen-style';
import { pruneOrphanPublicRecipes, syncPublicRecipe } from '@/lib/sync-public-recipe';

type PublicProfileRow = {
  id: string;
  name: string | null;
  phone: string | null;
  onboarding_completed_at: string | null;
  diet_choice: string | null;
  regional_cuisine: string | null;
  notifications_enabled: boolean | null;
};

export type SyncMemberResult =
  | { status: 'created'; userId: string; email: string }
  | { status: 'updated'; userId: string; email: string }
  | { status: 'linked'; userId: string; email: string }
  | { status: 'skipped'; reason: string; email?: string }
  | { status: 'error'; message: string; email?: string };

export type SyncMembersSummary = {
  created: number;
  updated: number;
  linked: number;
  skipped: number;
  errors: number;
  details: SyncMemberResult[];
};

export type SyncRecipesSummary = {
  synced: number;
  orphansRemoved: number;
};

export type SyncKitchenStylesSummary = {
  synced: number;
};

export type SupabaseDataSyncSummary = {
  members: SyncMembersSummary;
  recipes: SyncRecipesSummary;
  kitchenStyles: SyncKitchenStylesSummary;
};

async function fetchPublicProfile(authUserId: string): Promise<PublicProfileRow | null> {
  const rows = await queryPg<PublicProfileRow>(
    `SELECT
      id,
      name,
      phone,
      onboarding_completed_at,
      diet_choice::text AS diet_choice,
      regional_cuisine,
      notifications_enabled
    FROM public.profiles
    WHERE id = $1`,
    [authUserId],
  );
  return rows[0] ?? null;
}

function profileToUserFields(profile: PublicProfileRow | null) {
  const dietChoice = profile?.diet_choice?.trim() || 'Veg';
  const regionalCuisine = profile?.regional_cuisine?.trim() || 'All India';
  const hasCompletedOnboarding = Boolean(profile?.onboarding_completed_at);

  return {
    dietChoice,
    dietPreference: dietChoice,
    regionalCuisine,
    notificationsEnabled: profile?.notifications_enabled ?? false,
    ...(hasCompletedOnboarding ? { hasCompletedOnboarding: true } : {}),
  };
}

export async function syncAuthUserToRasoi(supabaseUserId: string): Promise<SyncMemberResult> {
  const authUser = await getSupabaseAuthUserById(supabaseUserId);
  if (!authUser) {
    return { status: 'error', message: 'Supabase auth user not found' };
  }

  return syncListedAuthUserToRasoi(authUser);
}

async function syncListedAuthUserToRasoi(authUser: ListedAuthUser): Promise<SyncMemberResult> {
  if (authUser.isAnonymous) {
    return {
      status: 'skipped',
      reason: 'Anonymous Supabase auth account',
      email: authUser.email ?? undefined,
    };
  }

  if (!authUser.email) {
    return { status: 'skipped', reason: 'Auth account has no email' };
  }

  const email = authUser.email.toLowerCase();
  const profile = await fetchPublicProfile(authUser.id);
  const profileFields = profileToUserFields(profile);
  const name = profile?.name?.trim() || authUser.name;
  const phone = profile?.phone?.trim() || authUser.phone || null;

  const [existingBySupabase, existingByEmail] = await Promise.all([
    db.user.findUnique({ where: { supabaseUserId: authUser.id } }),
    db.user.findUnique({ where: { email } }),
  ]);

  if (
    existingByEmail &&
    existingBySupabase &&
    existingByEmail.id !== existingBySupabase.id
  ) {
    return {
      status: 'error',
      message: 'Email and auth ID map to different Rasoi profiles',
      email,
    };
  }

  const existing = existingBySupabase ?? existingByEmail ?? null;

  if (existing) {
    const user = await db.user.update({
      where: { id: existing.id },
      data: {
        name,
        email,
        phone: phone ?? existing.phone,
        isGuest: false,
        isActive: true,
        supabaseUserId: authUser.id,
        ...profileFields,
        ...(!existing.hasCompletedOnboarding && profileFields.hasCompletedOnboarding
          ? { hasCompletedOnboarding: true }
          : {}),
      },
    });

    const status =
      existing.supabaseUserId === authUser.id ? 'updated' : 'linked';
    return { status, userId: user.id, email };
  }

  const [defaultPantry, trialUpdate] = await Promise.all([
    getDefaultPantryIngredients(),
    getAutoTrialWriteForNewUser(),
  ]);

  const user = await db.user.create({
    data: {
      name,
      email,
      phone,
      isGuest: false,
      isActive: true,
      supabaseUserId: authUser.id,
      pantryIngredients: JSON.stringify(defaultPantry ?? []),
      ...profileFields,
      ...trialUpdate,
    },
  });

  return { status: 'created', userId: user.id, email };
}

export async function syncSupabaseMembersToRasoi(): Promise<SyncMembersSummary> {
  const authUsers = await listSupabaseAuthUsers();
  const details: SyncMemberResult[] = [];

  for (const authUser of authUsers) {
    try {
      details.push(await syncListedAuthUserToRasoi(authUser));
    } catch (error) {
      details.push({
        status: 'error',
        message: error instanceof Error ? error.message : 'Sync failed',
        email: authUser.email ?? undefined,
      });
    }
  }

  const rasoiUsers = await db.user.findMany({
    where: {
      isGuest: false,
      email: { not: null },
      supabaseUserId: null,
    },
  });

  const authByEmail = new Map(
    authUsers
      .filter((user) => user.email)
      .map((user) => [user.email!.toLowerCase(), user]),
  );

  for (const rasoiUser of rasoiUsers) {
    const email = rasoiUser.email?.toLowerCase();
    if (!email) continue;
    const authUser = authByEmail.get(email);
    if (!authUser) continue;

    try {
      const result = await syncListedAuthUserToRasoi(authUser);
      details.push(result);
    } catch (error) {
      details.push({
        status: 'error',
        message: error instanceof Error ? error.message : 'Link failed',
        email,
      });
    }
  }

  return {
    created: details.filter((item) => item.status === 'created').length,
    updated: details.filter((item) => item.status === 'updated').length,
    linked: details.filter((item) => item.status === 'linked').length,
    skipped: details.filter((item) => item.status === 'skipped').length,
    errors: details.filter((item) => item.status === 'error').length,
    details,
  };
}

async function fetchAllRecipesForSync(): Promise<Recipe[]> {
  return queryPg<Recipe>(`
    SELECT
      id,
      title,
      "prepTime",
      calories,
      region,
      "kitchenStyleId",
      "kitchenStyleIds",
      "dietType",
      difficulty,
      description,
      "imageUrl",
      tags,
      ingredients,
      steps,
      published,
      "createdAt",
      "updatedAt"
    FROM rasoi."Recipe"
    ORDER BY id ASC
  `);
}

export async function syncRecipesToPublic(): Promise<SyncRecipesSummary> {
  const recipes = await fetchAllRecipesForSync();
  const orphansRemoved = await pruneOrphanPublicRecipes(recipes.map((recipe) => recipe.id));

  for (const recipe of recipes) {
    await syncPublicRecipe(recipe);
  }

  return { synced: recipes.length, orphansRemoved };
}

export async function syncKitchenStylesToPublic(): Promise<SyncKitchenStylesSummary> {
  const styles = await db.kitchenStyle.findMany({ orderBy: { sortOrder: 'asc' } });
  for (const style of styles) {
    await syncPublicKitchenStyle(style);
  }
  return { synced: styles.length };
}

export async function syncAllSupabaseData(): Promise<SupabaseDataSyncSummary> {
  const [members, recipes, kitchenStyles] = await Promise.all([
    syncSupabaseMembersToRasoi(),
    syncRecipesToPublic(),
    syncKitchenStylesToPublic(),
  ]);

  return { members, recipes, kitchenStyles };
}

export function formatSyncMembersSummary(summary: SyncMembersSummary): string {
  const parts = [
    `${summary.created} created`,
    `${summary.updated} updated`,
    `${summary.linked} linked`,
  ];
  if (summary.skipped > 0) parts.push(`${summary.skipped} skipped`);
  if (summary.errors > 0) parts.push(`${summary.errors} errors`);
  return parts.join(', ');
}
