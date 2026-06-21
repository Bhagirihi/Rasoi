import type { DietType } from '@/data/mockRecipes';

/** Matches backend `dietChoiceToDietType` — Jain users see Veg recipes. */
export function dietChoiceToDietType(choice: string): DietType | undefined {
  if (choice === 'Non-Veg') return 'Non-Veg';
  if (choice === 'Egg') return 'Egg';
  if (choice === 'Veg' || choice === 'Jain') return 'Veg';
  return undefined;
}
