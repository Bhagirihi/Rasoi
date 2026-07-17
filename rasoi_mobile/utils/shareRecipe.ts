import { Share } from 'react-native';

import type { Recipe } from '@/data/mockRecipes';

export async function shareRecipeOnWhatsApp(recipe: Recipe): Promise<void> {
  const steps = recipe.steps ?? [];
  const stepLines =
    steps.length > 0
      ? steps.slice(0, 4).map((step, index) => `${index + 1}. ${step}`)
      : ['Steps coming soon in the app.'];

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
