export type DietType = 'Veg' | 'Egg' | 'Non-Veg';
export type RecipeDifficulty = 'Easy' | 'Medium' | 'Hard';
export type RecipeTag = 'under20' | 'leftover' | 'kids' | 'quick' | 'festive';
export type SponsorPlacement = 'home' | 'recipes' | 'pantry' | 'saved' | 'recipe';
export type PlanTier = 'free' | 'trial' | 'paid';
export type DietChoice = 'Veg' | 'Egg' | 'Non-Veg' | 'Jain';
export type CuisineId = string;

export interface AppConfigResponse {
  paymentsEnabled: boolean;
}

export interface KitchenStyleResponse {
  id: string;
  label: string;
  tagline: string;
  mood: string;
  region: string;
  heroImage: string;
  active: boolean;
  sortOrder: number;
}

export interface RecipeIngredient {
  name: string;
  isStaple: boolean;
  recommendedBrand?: {
    name: string;
    logo: string;
  };
}

export interface RecipeResponse {
  id: string;
  title: string;
  prepTime: number;
  calories: number;
  region: string;
  kitchenStyleId: string;
  kitchenStyleIds: CuisineId[];
  dietType: DietType;
  difficulty: RecipeDifficulty;
  description: string;
  imageUrl: string;
  tags: RecipeTag[];
  ingredients: RecipeIngredient[];
  steps?: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface UserProfileResponse {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  isGuest: boolean;
  isActive: boolean;
  hasCompletedOnboarding: boolean;
  dietPreference: DietType;
  dietChoice: DietChoice;
  regionalCuisine: string;
  favoriteCuisines: CuisineId[];
  notificationsEnabled: boolean;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  locationUpdatedAt: string | null;
  termsAcceptedAt: string | null;
  createdAt: string;
  pantryIngredients: string[];
  savedRecipeIds: string[];
  plan: {
    planTier: PlanTier;
    trialStartedAt: string | null;
    hasUsedTrial: boolean;
  };
}
