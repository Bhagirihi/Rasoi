import type { Prisma } from '@/generated/prisma/client';

export const REGIONAL_CUISINES = [
  'All India',
  'North',
  'South',
  'East',
  'West',
  'Central',
] as const;

export const RECIPE_REGIONS = ['North', 'South', 'East', 'West', 'Central'] as const;

export const DIET_TYPES = ['Veg', 'Egg', 'Non-Veg'] as const;

export const DIET_CHOICES = ['Veg', 'Egg', 'Non-Veg', 'Jain'] as const;

export const DIET_CHOICE_LABELS: Record<(typeof DIET_CHOICES)[number], string> = {
  Veg: 'Veg',
  Egg: 'Eggitarian',
  'Non-Veg': 'Non-Veg',
  Jain: 'Jain',
};

export const RECIPE_TAGS = ['under20', 'leftover', 'kids', 'quick', 'festive'] as const;

export const FAST_FILTER_TAGS = ['under20', 'leftover', 'kids'] as const;

export const RECIPE_DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;

export type RegionalCuisine = (typeof REGIONAL_CUISINES)[number];
export type RecipeRegion = (typeof RECIPE_REGIONS)[number];
export type DietType = (typeof DIET_TYPES)[number];
export type DietChoice = (typeof DIET_CHOICES)[number];
export type RecipeTag = (typeof RECIPE_TAGS)[number];

/** Matches mobile `dietChoiceToFilter` — Jain users see Veg recipes. */
export function dietChoiceToDietType(choice: string): DietType | undefined {
  if (choice === 'Non-Veg') return 'Non-Veg';
  if (choice === 'Egg') return 'Egg';
  if (choice === 'Veg' || choice === 'Jain') return 'Veg';
  return undefined;
}

export interface RecipeFilterParams {
  region?: string;
  dietChoice?: string;
  dietType?: string;
  tag?: string;
  difficulty?: string;
  published?: string;
}

export function buildRecipeWhere(
  params: RecipeFilterParams,
  options?: { adminIncludeDrafts?: boolean },
): Prisma.RecipeWhereInput {
  const where: Prisma.RecipeWhereInput = {};

  const region = params.region?.trim();
  if (region && region !== 'all' && region !== 'All India') {
    where.region = region;
  }

  const dietType =
    params.dietType && params.dietType !== 'all'
      ? params.dietType
      : params.dietChoice && params.dietChoice !== 'all'
        ? dietChoiceToDietType(params.dietChoice)
        : undefined;

  if (dietType) {
    where.dietType = dietType;
  }

  const difficulty = params.difficulty?.trim();
  if (difficulty && difficulty !== 'all') {
    where.difficulty = difficulty;
  }

  const tag = params.tag?.trim();
  if (tag && tag !== 'all') {
    where.tags = { contains: `"${tag}"` };
  }

  if (params.published === 'published') {
    where.published = true;
  } else if (params.published === 'draft') {
    where.published = false;
  } else if (!options?.adminIncludeDrafts && params.published !== 'all') {
    where.published = true;
  }

  return where;
}

export interface UserFilterParams {
  dietChoice?: string;
  region?: string;
  memberType?: string;
  plan?: string;
}

export function buildUserWhere(params: UserFilterParams): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = {};

  const dietChoice = params.dietChoice?.trim();
  if (dietChoice && dietChoice !== 'all') {
    where.dietChoice = dietChoice;
  }

  const region = params.region?.trim();
  if (region && region !== 'all' && region !== 'All India') {
    where.regionalCuisine = region;
  }

  const memberType = params.memberType?.trim();
  if (memberType === 'guest') {
    where.isGuest = true;
  } else if (memberType === 'member') {
    where.isGuest = false;
  }

  const plan = params.plan?.trim();
  if (plan && plan !== 'all') {
    where.planTier = plan;
  }

  return where;
}
