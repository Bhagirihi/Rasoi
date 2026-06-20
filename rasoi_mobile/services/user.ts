import type { PlanTier } from '@/constants/plans';
import type { CuisineId, DietChoice } from '@/constants/theme';
import type { DietType } from '@/data/mockRecipes';
import type { UserProfileResponse } from '@/types/api';
import { authApiFetch } from '@/utils/api';
import type { OnboardingPayload } from '@/utils/storage';

export async function fetchCurrentUser(): Promise<UserProfileResponse> {
  return authApiFetch<UserProfileResponse>('/api/users/me');
}

export async function completeUserOnboarding(
  payload: OnboardingPayload,
): Promise<UserProfileResponse> {
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
  return authApiFetch<UserProfileResponse>('/api/users/me/location', {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export async function updatePantryIngredients(ingredients: string[]): Promise<UserProfileResponse> {
  return authApiFetch<UserProfileResponse>('/api/users/me/pantry', {
    method: 'PUT',
    body: JSON.stringify({ ingredients }),
  });
}

export async function updateSavedRecipeIds(recipeIds: string[]): Promise<UserProfileResponse> {
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
  await authApiFetch('/api/users/me/push-token', {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export async function deactivatePushTokens(expoPushToken?: string): Promise<void> {
  await authApiFetch('/api/users/me/push-token', {
    method: 'DELETE',
    body: JSON.stringify(expoPushToken ? { expoPushToken } : {}),
  });
}
