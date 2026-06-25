import { resolveRecipeSteps } from '@/utils/generateRecipeSteps';
import { localizeStepsToHindi } from '@/utils/localizeStepsToHindi';
import { getRecipeSteps } from '@/utils/recipeSteps';

/** Hindi cooking steps keyed by recipe id — extend as content grows. */
export const RECIPE_STEPS_HI: Record<string, string[]> = {
  '1': [
    'चावल और उड़द दाल 4–6 घंटे भिगोएँ; पीसकर रात भर खमीर उठाएँ।',
    'आलू उबालकर मसala भरवाँ तैयार करें।',
    'तवे पर पतला घोल फैलाकर आलू भरकर सुनहरा दोसा बनाएँ।',
    'नारियल की चटनी के साथ गर्मागर्म परोसें।',
  ],
  '2': [
    'प्याज़-टमाटर भूनकर काजू के साथ ग्रेवी बनाएँ।',
    'मक्खन, क्रीम और मसाले डालकर उबालें।',
    'पनीर डालकर हल्के हाथ से मिलाएँ।',
    'नान या चावल के साथ परोसें।',
  ],
  '15': [
    'रवा सूखा भूनकर अलग रखें।',
    'तड़का: राई, कड़ी पत्ता, मूंगफली और सब्ज़ियाँ।',
    'पानी, नमक और रवा डालकर लगातार चलाएँ।',
    '3 मिनट धककर पकाएँ; चटनी के साथ परोसें।',
  ],
};

export function getRecipeStepsHi(
  recipeId: string,
  title: string,
  recipe?: {
    ingredients: { name: string; isStaple: boolean }[];
    steps?: string[];
    prepTime?: number;
    dietType?: string;
    difficulty?: string;
    kitchenStyleId?: string;
    description?: string;
  },
): string[] {
  if (RECIPE_STEPS_HI[recipeId]) {
    return RECIPE_STEPS_HI[recipeId];
  }

  const englishSteps =
    recipe?.steps && recipe.steps.length > 0
      ? recipe.steps
      : recipe
        ? resolveRecipeSteps({
            title,
            kitchenStyleId: recipe.kitchenStyleId ?? 'north-indian',
            dietType: recipe.dietType ?? 'Veg',
            ingredients: recipe.ingredients,
            description: recipe.description,
            difficulty: recipe.difficulty,
            prepTime: recipe.prepTime ?? 30,
            steps: recipe.steps,
          })
        : getRecipeSteps(recipeId, title);

  return localizeStepsToHindi(englishSteps, title);
}
