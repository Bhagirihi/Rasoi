import type { Recipe, Sponsor, User } from '@/generated/prisma/client';
import type {
  CuisineId,
  DietChoice,
  DietType,
  PlanTier,
  RecipeDifficulty,
  RecipeIngredient,
  RecipeResponse,
  RecipeTag,
  SponsorPlacement,
  SponsorResponse,
  UserProfileResponse,
} from '@/lib/types';
import { normalizeRecipeIngredients } from '@/lib/recipe-ingredients';

export function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function serializeRecipe(recipe: Recipe): RecipeResponse {
  const kitchenStyleIds = parseJson<CuisineId[]>(recipe.kitchenStyleIds, []);
  const resolvedKitchenStyleIds =
    kitchenStyleIds.length > 0 ? kitchenStyleIds : [recipe.kitchenStyleId];

  return {
    id: recipe.id,
    title: recipe.title,
    prepTime: recipe.prepTime,
    calories: recipe.calories,
    region: recipe.region,
    kitchenStyleId: recipe.kitchenStyleId,
    kitchenStyleIds: resolvedKitchenStyleIds,
    dietType: recipe.dietType as DietType,
    difficulty: recipe.difficulty as RecipeDifficulty,
    description: recipe.description,
    imageUrl: recipe.imageUrl,
    tags: parseJson<RecipeTag[]>(recipe.tags, []),
    ingredients: normalizeRecipeIngredients(parseJson<unknown>(recipe.ingredients, [])),
    steps: recipe.steps ? parseJson<string[]>(recipe.steps, []) : undefined,
    published: recipe.published,
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
  };
}

export function serializeSponsor(sponsor: Sponsor): SponsorResponse {
  return {
    id: sponsor.id,
    placement: sponsor.placement as SponsorPlacement,
    brandName: sponsor.brandName,
    productLabel: sponsor.productLabel,
    tagline: sponsor.tagline,
    logoUrl: sponsor.logoUrl,
    cta: sponsor.cta,
    searchQuery: sponsor.searchQuery ?? undefined,
    recipeId: sponsor.recipeId ?? undefined,
    active: sponsor.active,
    priority: sponsor.priority,
  };
}

export function serializeUser(user: User): UserProfileResponse {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    name: user.name,
    isGuest: user.isGuest,
    isActive: user.isActive ?? true,
    hasCompletedOnboarding: user.hasCompletedOnboarding,
    dietPreference: user.dietPreference as DietType,
    dietChoice: user.dietChoice as DietChoice,
    regionalCuisine: user.regionalCuisine,
    favoriteCuisines: parseJson<CuisineId[]>(user.favoriteCuisines, []),
    notificationsEnabled: user.notificationsEnabled,
    pantryIngredients: parseJson<string[]>(user.pantryIngredients, []),
    savedRecipeIds: parseJson<string[]>(user.savedRecipeIds, []),
    plan: {
      planTier: user.planTier as PlanTier,
      trialStartedAt: user.trialStartedAt?.toISOString() ?? null,
      hasUsedTrial: user.hasUsedTrial,
    },
  };
}
