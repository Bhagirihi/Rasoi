import {
  Bean,
  ChefHat,
  Droplets,
  Drumstick,
  Leaf,
  Milk,
  Package,
  Sparkles,
  Wheat,
  type LucideIcon,
} from 'lucide-react-native';

export const PANTRY_BASE_SECTION_TITLES = new Set([
  'Staples',
  'Pulses',
  'Oils & fats',
  'Veggies',
  'Dairy',
  'Protein',
]);

const SECTION_ICON_MAP: Record<string, LucideIcon> = {
  Staples: Wheat,
  Pulses: Bean,
  'Oils & fats': Droplets,
  Veggies: Leaf,
  Dairy: Milk,
  Protein: Drumstick,
};

export function getPantrySectionIcon(title: string): LucideIcon {
  if (SECTION_ICON_MAP[title]) {
    return SECTION_ICON_MAP[title];
  }
  if (title.toLowerCase().includes('recipe') || title.toLowerCase().includes('pick')) {
    return ChefHat;
  }
  return Sparkles;
}
