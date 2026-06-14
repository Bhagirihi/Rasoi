import { Share } from 'react-native';

import type { Recipe } from '@/data/mockRecipes';
import { getRecipeSteps } from '@/utils/recipeSteps';

export async function shareRecipeOnWhatsApp(recipe: Recipe): Promise<void> {
  const steps = recipe.steps ?? getRecipeSteps(recipe.id, recipe.title);
  const stepLines = steps.slice(0, 4).map((step, index) => `${index + 1}. ${step}`);

  const message = [
    `🍽 ${recipe.title}`,
    `${recipe.prepTime} min · ${recipe.region} · ${recipe.dietType}`,
    '',
    ...stepLines,
    '',
    'Sent from Rasoi — Indian dinner ideas from your pantry.',
  ].join('\n');

  await Share.share({
    message,
    title: recipe.title,
  });
}
