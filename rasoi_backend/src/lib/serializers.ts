import type { Recipe, Sponsor, User } from '@/lib/db/types';
import { serializeUserPlan } from '@/lib/plan-serializer';
import { parseKitchenPreferences } from '@/lib/kitchen-preferences';
import type {
  CuisineId,
  DietChoice,
  DietType,
  RecipeDifficulty,
  RecipeIngredient,
  RecipeResponse,
  RecipeTag,
  SponsorPlacement,
  SponsorResponse,
  UserProfileResponse,
} from '@/lib/types';
import { normalizeRecipeIngredients } from '@/lib/recipe-ingredients';
import { buildRecipeDescription, buildRecipeDescriptionHi } from '@/lib/recipe-description';
import { buildDetailedStepsHi } from '@/lib/recipe-content-hi';
import { resolveStepsForRecipe } from '@/lib/recipe-steps';

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

  const ingredients = normalizeRecipeIngredients(parseJson<unknown>(recipe.ingredients, []));
  const steps = resolveStepsForRecipe(recipe);
  const storedStepsHi = parseJson<string[]>(recipe.stepsHi ?? '[]', []);
  const storedDescHi = recipe.descriptionHi?.trim() ?? '';

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
    description: recipe.description?.trim() || buildRecipeDescription({
      title: recipe.title,
      kitchenStyleId: recipe.kitchenStyleId,
      dietType: recipe.dietType,
      ingredients,
      prepTime: recipe.prepTime,
      difficulty: recipe.difficulty,
      description: recipe.description,
      steps,
    }),
    descriptionHi:
      storedDescHi ||
      buildRecipeDescriptionHi({
        title: recipe.title,
        kitchenStyleId: recipe.kitchenStyleId,
        dietType: recipe.dietType,
        ingredients,
        prepTime: recipe.prepTime,
        difficulty: recipe.difficulty,
        steps,
      }),
    imageUrl: recipe.imageUrl,
    tags: parseJson<RecipeTag[]>(recipe.tags, []),
    ingredients,
    steps,
    stepsHi:
      storedStepsHi.length > 0 ? storedStepsHi : buildDetailedStepsHi({
        title: recipe.title,
        kitchenStyleId: recipe.kitchenStyleId,
        dietType: recipe.dietType,
        ingredients,
        prepTime: recipe.prepTime,
        difficulty: recipe.difficulty,
        description: recipe.description,
        steps,
      }),
    published: recipe.published,
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
  };
}

/** List/bootstrap payload — omit cooking steps to shrink mobile cold-start downloads. */
export function serializeRecipeListItem(recipe: Recipe): RecipeResponse {
  const full = serializeRecipe(recipe);
  return { ...full, steps: [] };
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
    city: user.city ?? null,
    state: user.state ?? null,
    latitude: user.latitude ?? null,
    longitude: user.longitude ?? null,
    locationUpdatedAt: user.locationUpdatedAt?.toISOString() ?? null,
    termsAcceptedAt: user.termsAcceptedAt?.toISOString() ?? null,
    termsAcceptedVersion: user.termsAcceptedVersion ?? null,
    createdAt: user.createdAt.toISOString(),
  pantryIngredients: parseJson<string[]>(user.pantryIngredients, []),
  savedRecipeIds: parseJson<string[]>(user.savedRecipeIds, []),
  kitchenPreferences: parseKitchenPreferences(user.kitchenPreferences),
  plan: serializeUserPlan(user),
  };
}
