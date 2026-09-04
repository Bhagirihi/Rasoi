import { PANTRY_SECTIONS } from '@/lib/pantry-sections';

export type PantrySectionName = 'Staples' | 'Pulses' | 'Veggies' | 'Dairy' | 'Protein' | 'Other';

const STAPLE_NAMES = new Set<string>(
  PANTRY_SECTIONS.find((section) => section.title === 'Staples')?.items ?? [],
);
const PULSE_NAMES = new Set<string>(
  PANTRY_SECTIONS.find((section) => section.title === 'Pulses')?.items ?? [],
);
const VEGGIE_NAMES = new Set<string>(
  PANTRY_SECTIONS.find((section) => section.title === 'Veggies')?.items ?? [],
);
const DAIRY_NAMES = new Set<string>(
  PANTRY_SECTIONS.find((section) => section.title === 'Dairy')?.items ?? [],
);
const PROTEIN_NAMES = new Set<string>([
  'Chicken',
  'Fish',
  'Mutton',
  'Prawn',
  'Eggs',
  'Anda',
  'Paneer',
  'Beef',
  'Pork',
  'Duck',
  'Lamb',
  'Keema',
  'Bhetki',
  'Gosht',
  'Maas',
  'Machhli',
  'Chingri',
  'Ilish',
]);

export function resolveIngredientSection(name: string, isStaple: boolean): PantrySectionName {
  if (isStaple || STAPLE_NAMES.has(name)) return 'Staples';
  if (PULSE_NAMES.has(name)) return 'Pulses';
  if (DAIRY_NAMES.has(name)) return 'Dairy';
  if (VEGGIE_NAMES.has(name)) return 'Veggies';
  if (PROTEIN_NAMES.has(name)) return 'Protein';
  return 'Other';
}
