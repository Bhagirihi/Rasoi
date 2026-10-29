export const SPONSOR_PLACEMENT_VALUES = [
  'home',
  'recipes',
  'pantry',
  'saved',
  'recipe',
] as const;

export type SponsorPlacement = (typeof SPONSOR_PLACEMENT_VALUES)[number];

export const SPONSOR_PLACEMENT_OPTIONS: ReadonlyArray<{ value: SponsorPlacement; label: string }> = [
  { value: 'home', label: 'Home' },
  { value: 'recipes', label: 'Recipes' },
  { value: 'pantry', label: 'Pantry' },
  { value: 'saved', label: 'Saved' },
  { value: 'recipe', label: 'Recipe detail' },
];

export function getSponsorPlacementLabel(placement: string): string {
  const fromOptions = SPONSOR_PLACEMENT_OPTIONS.find((option) => option.value === placement)?.label;
  if (fromOptions) return fromOptions;

  const applicationLabels: Record<string, string> = {
    multiple: 'Multiple screens',
  };

  return applicationLabels[placement] ?? placement;
}

export const SPONSOR_APPLICATION_PLACEMENT_VALUES = [
  'home',
  'recipes',
  'pantry',
  'saved',
  'recipe',
  'multiple',
] as const;

export type SponsorApplicationPlacement = (typeof SPONSOR_APPLICATION_PLACEMENT_VALUES)[number];

export const SPONSOR_APPLICATION_PLACEMENT_OPTIONS: ReadonlyArray<{
  value: SponsorApplicationPlacement;
  label: string;
  hint: string;
}> = [
  {
    value: 'home',
    label: 'Home',
    hint: "Tonight's pick on the main home tab when users open the app",
  },
  {
    value: 'recipes',
    label: 'Recipes',
    hint: 'Featured rail while users browse and search dishes',
  },
  {
    value: 'pantry',
    label: 'Pantry',
    hint: 'Sponsored essentials while users stock ingredients',
  },
  {
    value: 'saved',
    label: 'Saved',
    hint: 'Placement on saved recipes while users plan repeat meals',
  },
  {
    value: 'recipe',
    label: 'Recipe detail',
    hint: 'Native brand card inside a recipe while users cook',
  },
  {
    value: 'multiple',
    label: 'Multiple screens',
    hint: 'Bundle placements across Home, Recipes, Pantry, Saved, and Recipe detail',
  },
];
