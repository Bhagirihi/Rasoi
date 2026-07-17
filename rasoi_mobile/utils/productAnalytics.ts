import { logFirebaseEvent } from '@/utils/firebase';

export type RecipeSuggestionSource =
  | 'home_top_pick'
  | 'home_late_night'
  | 'home_also_tonight'
  | 'home_seasonal'
  | 'home_plan_tomorrow'
  | 'home_recent_cooks'
  | 'recipe_list'
  | 'recipe_detail'
  | 'saved'
  | 'other';

export type DietFilterSource = 'onboarding' | 'settings' | 'home' | 'other';

/** User finished the onboarding preference flow (diet, cuisine, permissions). */
export function trackOnboardingComplete(params: {
  dietChoice: string;
  regionalCuisine: string;
  notificationsEnabled: boolean;
  isGuest: boolean;
}): void {
  void logFirebaseEvent('onboarding_complete', {
    diet_choice: params.dietChoice,
    regional_cuisine: params.regionalCuisine,
    notifications_enabled: params.notificationsEnabled,
    account_type: params.isGuest ? 'guest' : 'registered',
  });
}

/** User tapped a daily / home meal suggestion card. */
export function trackRecipeSuggestionTap(params: {
  recipeId: string;
  recipeName: string;
  source: RecipeSuggestionSource;
  mealSlot?: string;
}): void {
  void logFirebaseEvent('recipe_suggestion_tap', {
    recipe_id: params.recipeId,
    recipe_name: params.recipeName.slice(0, 100),
    source: params.source,
    meal_slot: params.mealSlot ?? 'unknown',
  });
}

/** User changed diet filter (onboarding, settings, or in-app). */
export function trackDietFilterChanged(params: {
  dietChoice: string;
  previousDiet?: string;
  source: DietFilterSource;
}): void {
  void logFirebaseEvent('diet_filter_changed', {
    diet_choice: params.dietChoice,
    previous_diet: params.previousDiet ?? 'unknown',
    source: params.source,
  });
}
