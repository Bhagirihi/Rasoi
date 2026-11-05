import { Share } from 'react-native';

import { SITE_BASE_URL } from '@/constants/links';
import type { Recipe } from '@/data/mockRecipes';
import { getPlayStoreListingUrl } from '@/utils/storeReview';

export async function shareRecipeOnWhatsApp(recipe: Recipe): Promise<void> {
  const steps = recipe.steps ?? [];
  const stepLines =
    steps.length > 0
      ? steps.slice(0, 4).map((step, index) => `${index + 1}. ${step}`)
      : ['Steps coming soon in the app.'];

  const appLink = `${SITE_BASE_URL}/download`;
  const playStore = getPlayStoreListingUrl();

  const message = [
    `🍽 ${recipe.title}`,
    `${recipe.prepTime} min · ${recipe.region} · ${recipe.dietType}`,
    '',
    ...stepLines,
    '',
    'Cook this in Rasoi — Indian dinner ideas from your pantry.',
    `Get the app: ${appLink}`,
    `Android: ${playStore}`,
  ].join('\n');

  await Share.share({
    message,
    title: recipe.title,
  });
}
