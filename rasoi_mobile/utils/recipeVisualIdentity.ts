import { CUISINE_OPTIONS } from '@/constants/theme';
import type { Recipe } from '@/data/mockRecipes';

export type RecipeVisualIdentity = {
  kitchenStyleId: string;
  kitchenLabel: string;
  mood: string;
  region: string;
  emoji: string;
  gradient: readonly [string, string];
  accent: string;
  dietColor: string;
  dietLabel: string;
  shortRegion: string;
  /** Short cuisine name for compact badges (not geographic region). */
  shortCaption: string;
  tagLabels: string[];
};

/** Rasoi brand palette only — warm saffron, orange, green (no purple/teal). */
const REGION_GRADIENTS: Record<string, readonly [string, string]> = {
  North: ['#8B3A0A', '#FF9933'],
  South: ['#0A5C40', '#00A86B'],
  West: ['#7A4E08', '#FF6B35'],
  East: ['#6B2E0A', '#FF9933'],
  Central: ['#5C3410', '#C44A00'],
};

const REGION_ACCENT: Record<string, string> = {
  North: '#FF9933',
  South: '#00A86B',
  West: '#FF6B35',
  East: '#FF9933',
  Central: '#C44A00',
};

const DEFAULT_GRADIENT = ['#1A1A2E', '#FF6B35'] as const;

const KITCHEN_EMOJI: Record<string, string> = {
  gujarati: '🥗',
  street: '🍽️',
  south: '🥞',
  north: '🫓',
  punjabi: '🧈',
  rajasthani: '🫕',
  bengali: '🐟',
  maharashtrian: '🥘',
  hyderabadi: '🍚',
  goan: '🦐',
  kerala: '🥥',
  chinese: '🍜',
  assamese: '🌿',
  kashmiri: '🍵',
  chettinad: '🌶️',
  jain: '🌱',
};

const DIET_COLORS: Record<Recipe['dietType'], string> = {
  Veg: '#00A86B',
  Egg: '#F4C430',
  'Non-Veg': '#E53935',
};

const TAG_LABELS: Record<string, string> = {
  quick: 'Quick',
  under20: '<20 min',
  kids: 'Kids',
  leftover: 'Leftover',
  festive: 'Festive',
};

function primaryKitchenStyleId(recipe: Recipe): string {
  if (recipe.kitchenStyleIds?.length) return recipe.kitchenStyleIds[0];
  if (recipe.kitchenStyleId) return recipe.kitchenStyleId;
  return 'north';
}

function titleFallbackEmoji(title: string): string {
  const first = title.trim().charAt(0).toUpperCase();
  return first && /[A-Z\u0900-\u097F]/.test(first) ? '🍛' : '🍛';
}

function formatStyleId(id: string): string {
  return id
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function shortKitchenCaption(label: string): string {
  const word = label.split(/[\s-]/).filter(Boolean)[0] ?? label;
  if (word.length <= 11) return word;
  return `${word.slice(0, 10)}…`;
}

export function getRecipeVisualIdentity(recipe: Recipe): RecipeVisualIdentity {
  const kitchenStyleId = primaryKitchenStyleId(recipe);
  const cuisine = CUISINE_OPTIONS.find((item) => item.id === kitchenStyleId);
  const kitchenLabel = cuisine?.label ?? formatStyleId(kitchenStyleId);
  const region = recipe.region?.trim() || cuisine?.region || 'North';
  const gradient = REGION_GRADIENTS[region] ?? DEFAULT_GRADIENT;
  const accent = REGION_ACCENT[region] ?? '#FF6B35';
  const emoji = KITCHEN_EMOJI[kitchenStyleId] ?? titleFallbackEmoji(recipe.title);
  const tagLabels = (recipe.tags ?? [])
    .map((tag) => TAG_LABELS[tag])
    .filter((label): label is string => Boolean(label))
    .slice(0, 2);

  return {
    kitchenStyleId,
    kitchenLabel,
    mood: cuisine?.mood ?? 'Home',
    region,
    emoji,
    gradient,
    accent,
    dietColor: DIET_COLORS[recipe.dietType] ?? DIET_COLORS.Veg,
    dietLabel: recipe.dietType,
    shortRegion: region,
    shortCaption: shortKitchenCaption(kitchenLabel),
    tagLabels,
  };
}
