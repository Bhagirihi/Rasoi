import type { PlanTier } from '@/constants/plans';
import type { CuisineId, DietChoice } from '@/constants/theme';
import type { DietType } from '@/data/mockRecipes';
import type { UserProfileResponse } from '@/types/api';
import { authApiFetch } from '@/utils/api';
import { parseJson } from '@/utils/parseJson';
import { getRasoiDb, isSupabaseDirectMode } from '@/utils/rasoiDb';
import { requireSupabaseClient } from '@/utils/supabase';
import { serializeUserProfile, type DbUserRow } from '@/utils/serializeUserProfile';
import type { OnboardingPayload } from '@/utils/storage';

async function requireSupabaseAuthUserId(): Promise<string> {
  const supabase = requireSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.id) {
    throw new Error('Not authenticated');
  }

  return user.id;
}

async function fetchOwnUserRow(): Promise<DbUserRow> {
  const supabaseUserId = await requireSupabaseAuthUserId();
  const { data, error } = await getRasoiDb()
    .from('User')
    .select('*')
    .eq('supabaseUserId', supabaseUserId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error('User profile not found');
  }

  return data as DbUserRow;
}

async function fetchCurrentUserFromSupabase(): Promise<UserProfileResponse> {
  const row = await fetchOwnUserRow();
  return serializeUserProfile(row);
}

async function updateOwnUserRow(patch: Record<string, unknown>): Promise<UserProfileResponse> {
  const supabaseUserId = await requireSupabaseAuthUserId();
  const { data, error } = await getRasoiDb()
    .from('User')
    .update({
      ...patch,
      updatedAt: new Date().toISOString(),
    })
    .eq('supabaseUserId', supabaseUserId)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return serializeUserProfile(data as DbUserRow);
}

export async function fetchCurrentUser(): Promise<UserProfileResponse> {
  if (isSupabaseDirectMode()) {
    try {
      return await fetchCurrentUserFromSupabase();
    } catch (error) {
      console.warn('[user] Supabase read failed, falling back to API', error);
    }
  }

  return authApiFetch<UserProfileResponse>('/api/users/me');
}

export async function completeUserOnboarding(
  payload: OnboardingPayload,
): Promise<UserProfileResponse> {
  if (isSupabaseDirectMode()) {
    try {
      return await updateOwnUserRow({
        hasCompletedOnboarding: true,
        dietPreference: payload.dietPreference,
        dietChoice: payload.dietChoice,
        regionalCuisine: payload.regionalCuisine,
        favoriteCuisines: JSON.stringify(payload.favoriteCuisines),
        notificationsEnabled: payload.notificationsEnabled,
      });
    } catch (error) {
      console.warn('[user] Supabase onboarding failed, falling back to API', error);
    }
  }

  return authApiFetch<UserProfileResponse>('/api/users/me/onboarding', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateUserProfile(input: {
  name?: string;
  phone?: string;
  dietChoice?: DietChoice;
  dietPreference?: DietType;
  regionalCuisine?: string;
  favoriteCuisines?: CuisineId[];
  notificationsEnabled?: boolean;
}): Promise<UserProfileResponse> {
  if (isSupabaseDirectMode()) {
    try {
      const patch: Record<string, unknown> = {};
      if (input.name !== undefined) patch.name = input.name;
      if (input.phone !== undefined) patch.phone = input.phone;
      if (input.dietChoice !== undefined) patch.dietChoice = input.dietChoice;
      if (input.dietPreference !== undefined) patch.dietPreference = input.dietPreference;
      if (input.regionalCuisine !== undefined) patch.regionalCuisine = input.regionalCuisine;
      if (input.favoriteCuisines !== undefined) {
        patch.favoriteCuisines = JSON.stringify(input.favoriteCuisines);
      }
      if (input.notificationsEnabled !== undefined) {
        patch.notificationsEnabled = input.notificationsEnabled;
      }
      return await updateOwnUserRow(patch);
    } catch (error) {
      console.warn('[user] Supabase profile update failed, falling back to API', error);
    }
  }

  return authApiFetch<UserProfileResponse>('/api/users/me', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function updateUserLocation(input: {
  city: string | null;
  state?: string | null;
  latitude: number | null;
  longitude: number | null;
}): Promise<UserProfileResponse> {
  if (isSupabaseDirectMode()) {
    try {
      return await updateOwnUserRow({
        city: input.city,
        state: input.state ?? null,
        latitude: input.latitude,
        longitude: input.longitude,
        locationUpdatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.warn('[user] Supabase location update failed, falling back to API', error);
    }
  }

  return authApiFetch<UserProfileResponse>('/api/users/me/location', {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export async function updatePantryIngredients(ingredients: string[]): Promise<UserProfileResponse> {
  if (isSupabaseDirectMode()) {
    try {
      return await updateOwnUserRow({
        pantryIngredients: JSON.stringify(ingredients),
      });
    } catch (error) {
      console.warn('[user] Supabase pantry update failed, falling back to API', error);
    }
  }

  return authApiFetch<UserProfileResponse>('/api/users/me/pantry', {
    method: 'PUT',
    body: JSON.stringify({ ingredients }),
  });
}

export async function updateSavedRecipeIds(recipeIds: string[]): Promise<UserProfileResponse> {
  if (isSupabaseDirectMode()) {
    try {
      return await updateOwnUserRow({
        savedRecipeIds: JSON.stringify(recipeIds),
      });
    } catch (error) {
      console.warn('[user] Supabase saved-recipes update failed, falling back to API', error);
    }
  }

  return authApiFetch<UserProfileResponse>('/api/users/me/saved-recipes', {
    method: 'PUT',
    body: JSON.stringify({ recipeIds }),
  });
}

export async function updateUserPlan(input: {
  planTier: PlanTier;
  trialStartedAt?: string | null;
  hasUsedTrial?: boolean;
}): Promise<UserProfileResponse['plan']> {
  if (isSupabaseDirectMode() && input.planTier === 'trial') {
    try {
      const { data, error } = await requireSupabaseClient().schema('rasoi').rpc('start_trial');
      if (error) {
        throw new Error(error.message);
      }
      const plan = data as UserProfileResponse['plan'];
      return plan;
    } catch (error) {
      console.warn('[user] Supabase trial start failed, falling back to API', error);
    }
  }

  const data = await authApiFetch<UserProfileResponse['plan'] | UserProfileResponse>(
    '/api/users/me/plan',
    {
      method: 'PUT',
      body: JSON.stringify(input),
    },
  );
  if (data && typeof data === 'object' && 'plan' in data && data.plan) {
    return data.plan;
  }
  return data as UserProfileResponse['plan'];
}

export async function registerPushToken(input: {
  expoPushToken: string;
  platform?: 'ios' | 'android' | 'web';
  active?: boolean;
}): Promise<void> {
  if (isSupabaseDirectMode()) {
    try {
      const row = await fetchOwnUserRow();
      const { error } = await getRasoiDb().from('PushToken').upsert(
        {
          userId: row.id,
          expoPushToken: input.expoPushToken,
          platform: input.platform ?? null,
          active: input.active ?? true,
          updatedAt: new Date().toISOString(),
        },
        { onConflict: 'userId,expoPushToken' },
      );

      if (error) {
        throw new Error(error.message);
      }
      return;
    } catch (error) {
      console.warn('[user] Supabase push-token upsert failed, falling back to API', error);
    }
  }

  await authApiFetch('/api/users/me/push-token', {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export async function deactivatePushTokens(expoPushToken?: string): Promise<void> {
  if (isSupabaseDirectMode()) {
    try {
      const row = await fetchOwnUserRow();
      let query = getRasoiDb()
        .from('PushToken')
        .update({ active: false, updatedAt: new Date().toISOString() })
        .eq('userId', row.id);

      if (expoPushToken) {
        query = query.eq('expoPushToken', expoPushToken);
      }

      const { error } = await query;
      if (error) {
        throw new Error(error.message);
      }
      return;
    } catch (error) {
      console.warn('[user] Supabase push-token deactivate failed, falling back to API', error);
    }
  }

  await authApiFetch('/api/users/me/push-token', {
    method: 'DELETE',
    body: JSON.stringify(expoPushToken ? { expoPushToken } : {}),
  });
}

export async function exportUserData(): Promise<unknown> {
  return authApiFetch('/api/users/me/export');
}

export async function deleteUserAccount(confirmEmail?: string): Promise<void> {
  await authApiFetch('/api/users/me', {
    method: 'DELETE',
    body: JSON.stringify(confirmEmail ? { confirmEmail } : {}),
  });
}

export async function getOwnRasoiUserId(): Promise<string | null> {
  if (!isSupabaseDirectMode()) {
    return null;
  }

  try {
    const row = await fetchOwnUserRow();
    return row.id;
  } catch {
    return null;
  }
}
