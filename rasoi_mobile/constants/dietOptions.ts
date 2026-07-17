import { Drumstick, Egg, Hand, Leaf, type LucideIcon } from 'lucide-react-native';

import { colors, type DietChoice } from '@/constants/theme';

export type DietPreferenceOption = {
  value: DietChoice;
  label: string;
  subtitle: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

/** Shared diet cards — same look as onboarding "What is your dietary preference?" */
export const DIET_PREFERENCE_OPTIONS: DietPreferenceOption[] = [
  {
    value: 'Veg',
    label: 'Veg',
    subtitle: 'NO MEAT OR EGGS',
    icon: Leaf,
    iconBg: colors.dark.accentGreen,
    iconColor: colors.green,
  },
  {
    value: 'Egg',
    label: 'Eggitarian',
    subtitle: 'VEGETARIAN PLUS EGGS',
    icon: Egg,
    iconBg: colors.dark.accentEgg,
    iconColor: colors.egg,
  },
  {
    value: 'Non-Veg',
    label: 'Non-Veg',
    subtitle: 'VEG + EGG + MEAT, POULTRY & SEAFOOD',
    icon: Drumstick,
    iconBg: colors.dark.accentRed,
    iconColor: '#FF6B6B',
  },
  {
    value: 'Jain',
    label: 'Jain',
    subtitle: 'NO ONION, GARLIC OR ROOT VEG',
    icon: Hand,
    iconBg: colors.dark.accentOrange,
    iconColor: colors.saffron,
  },
];

export function getDietPreferenceOption(value: DietChoice): DietPreferenceOption {
  return DIET_PREFERENCE_OPTIONS.find((option) => option.value === value) ?? DIET_PREFERENCE_OPTIONS[0];
}
