import type { Recipe } from '@/data/mockRecipes';
import { getRecipeVisualIdentity } from '@/utils/recipeVisualIdentity';

/** Tags that duplicate the prep-time meta pill. */
const TIME_DUPLICATE_TAGS = new Set(['Quick', '<20 min']);

export type HomeRecipeSection = 'pick' | 'also';

export function getHomeDisplayTags(recipe: Recipe, section: HomeRecipeSection): string[] {
  const visual = getRecipeVisualIdentity(recipe);
  const cuisine = visual.shortCaption;

  if (section === 'also') {
    const extras = visual.tagLabels.filter(
      (label) => !TIME_DUPLICATE_TAGS.has(label) && label !== cuisine,
    );
    return [cuisine, ...extras].slice(0, 2);
  }

  const extras = visual.tagLabels.filter((label) => !TIME_DUPLICATE_TAGS.has(label));
  return [...new Set([cuisine, ...extras])].slice(0, 3);
}
