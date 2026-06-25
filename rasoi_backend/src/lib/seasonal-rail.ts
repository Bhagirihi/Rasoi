import { dietChoiceToDietType } from '@/lib/recipe-filters';
import { isJainSafeRecipe } from '@/lib/jain-safe';
import type { Recipe } from '@/lib/db/types';
import { serializeRecipeListItem } from '@/lib/serializers';
import { parseJson } from '@/lib/serializers';
import type { RecipeResponse } from '@/lib/types';

export type SeasonalRailPick = {
  recipe: RecipeResponse;
  reason: string;
};

export type SeasonalRailConfig = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
};

/** Approximate Indian festival / season windows (IST calendar dates). */
export function getSeasonalRailConfig(month: number, day: number): SeasonalRailConfig | null {
  if (month === 10 || (month === 11 && day <= 15)) {
    return {
      id: 'diwali',
      title: 'Diwali specials',
      subtitle: 'Festive sweets and party dishes for the season',
      tags: ['festive'],
    };
  }
  if (month === 3 && day <= 25) {
    return {
      id: 'holi',
      title: 'Holi week',
      subtitle: 'Colourful platters and celebration snacks',
      tags: ['festive', 'kids'],
    };
  }
  if (month >= 9 && month <= 10 && day >= 15 && day <= 30) {
    return {
      id: 'navratri',
      title: 'Navratri & vrat',
      subtitle: 'Light fasting-friendly ideas',
      tags: ['festive'],
    };
  }
  if (month >= 4 && month <= 6) {
    return {
      id: 'summer',
      title: 'Summer coolers',
      subtitle: 'Light meals for hot afternoons',
      tags: ['quick', 'under20'],
    };
  }
  if (month === 12 || month === 1) {
    return {
      id: 'winter',
      title: 'Winter comfort',
      subtitle: 'Hearty bowls and warm dinners',
      tags: ['festive', 'leftover'],
    };
  }
  if (day <= 7 || day >= 25) {
    return {
      id: 'month-end',
      title: 'Pantry-friendly picks',
      subtitle: 'Cook with what you already have',
      tags: ['leftover', 'under20'],
    };
  }
  return null;
}

export function buildSeasonalRailPicks(
  user: {
    dietChoice: string;
    regionalCuisine: string;
    favoriteCuisines: string;
  },
  recipes: Recipe[],
  config: SeasonalRailConfig,
  count = 3,
): SeasonalRailPick[] {
  const dietType = dietChoiceToDietType(user.dietChoice);
  if (!dietType) return [];

  const pool = recipes.filter((recipe) => {
    if (recipe.dietType !== dietType) return false;
    if (user.dietChoice === 'Jain' && !isJainSafeRecipe(recipe)) return false;
    const tags = parseJson<string[]>(recipe.tags, []);
    return config.tags.some((tag) => tags.includes(tag));
  });

  const ranked = pool
    .map((recipe) => ({ recipe, score: recipe.popularityScore ?? 50 }))
    .sort((a, b) => b.score - a.score);

  return ranked.slice(0, count).map(({ recipe }) => ({
    recipe: serializeRecipeListItem(recipe),
    reason: config.subtitle,
  }));
}
