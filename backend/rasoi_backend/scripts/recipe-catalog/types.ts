export type RecipeCatalogEntry = {
  id: string;
  kitchenStyleId: string;
  kitchenStyleIds?: string[];
  title: string;
  prepTime: number;
  calories: number;
  region: string;
  dietType: 'Veg' | 'Egg' | 'Non-Veg';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  imageKeyword: string;
  tags: string[];
  ingredients: Array<{ name: string; isStaple: boolean }>;
  steps: string[];
};
