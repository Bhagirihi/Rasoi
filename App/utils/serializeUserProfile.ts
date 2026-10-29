import type { PlanTier } from '@/constants/plans';
import type { CuisineId, DietChoice } from '@/constants/theme';
import type { Gender } from '@/constants/genderOptions';
import type { DietType } from '@/data/mockRecipes';
import type { UserProfileResponse } from '@/types/api';
import { parseJson } from '@/utils/parseJson';
import { parseKitchenPreferences } from '@/utils/kitchenPreferences';

export type DbUserRow = {
  id: string;
  supabaseUserId: string | null;
  email: string | null;
  phone: string | null;
  name: string;
  gender?: string | null;
  isGuest: boolean;
  isActive?: boolean;
  hasCompletedOnboarding: boolean;
  dietPreference: string;
  dietChoice: string;
  regionalCuisine: string;
  favoriteCuisines: string;
  notificationsEnabled: boolean;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  locationUpdatedAt: string | null;
  termsAcceptedAt: string | null;
  termsAcceptedVersion: string | null;
  createdAt: string;
  pantryIngredients: string;
  savedRecipeIds: string;
  planTier: string;
  trialStartedAt: string | null;
  hasUsedTrial: boolean;
  trialBonusDays?: number;
  yearlyPromoOfferTag?: string | null;
  kitchenPreferences?: string;
};

export function serializeUserProfile(row: DbUserRow): UserProfileResponse {
  return {
    id: row.id,
    email: row.email,
    phone: row.phone,
    name: row.name,
    gender: (row.gender as Gender | null) ?? null,
    isGuest: row.isGuest,
    isActive: row.isActive ?? true,
    hasCompletedOnboarding: row.hasCompletedOnboarding,
    dietPreference: row.dietPreference as DietType,
    dietChoice: row.dietChoice as DietChoice,
    regionalCuisine: row.regionalCuisine,
    favoriteCuisines: parseJson<CuisineId[]>(row.favoriteCuisines, []),
    notificationsEnabled: row.notificationsEnabled,
    city: row.city ?? null,
    state: row.state ?? null,
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    locationUpdatedAt: row.locationUpdatedAt,
    pantryIngredients: parseJson<string[]>(row.pantryIngredients, []),
    savedRecipeIds: parseJson<string[]>(row.savedRecipeIds, []),
    kitchenPreferences: parseKitchenPreferences(
      parseJson(row.kitchenPreferences ?? '{}', {}),
    ),
    plan: {
      planTier: row.planTier as PlanTier,
      trialStartedAt: row.trialStartedAt,
      hasUsedTrial: row.hasUsedTrial,
      trialBonusDays: row.trialBonusDays ?? 0,
      yearlyPromoOfferTag: row.yearlyPromoOfferTag ?? null,
    },
  };
}
