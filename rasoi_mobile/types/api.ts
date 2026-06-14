import type { PlanTier } from '@/constants/plans';
import type { CuisineId, DietChoice } from '@/constants/theme';
import type { DietType } from '@/data/mockRecipes';

export type SponsorPlacement = 'home' | 'pantry' | 'recipe';

export interface UserProfileResponse {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  isGuest: boolean;
  hasCompletedOnboarding: boolean;
  dietPreference: DietType;
  dietChoice: DietChoice;
  regionalCuisine: string;
  favoriteCuisines: CuisineId[];
  notificationsEnabled: boolean;
  pantryIngredients: string[];
  savedRecipeIds: string[];
  plan: {
    planTier: PlanTier;
    trialStartedAt: string | null;
    hasUsedTrial: boolean;
  };
}

export interface AuthResponse {
  token: string;
  user: UserProfileResponse;
}

export interface SponsorResponse {
  id: string;
  placement: SponsorPlacement;
  brandName: string;
  productLabel: string;
  tagline: string;
  logoUrl: string;
  cta: string;
  searchQuery?: string;
  recipeId?: string;
  active: boolean;
  priority: number;
}
