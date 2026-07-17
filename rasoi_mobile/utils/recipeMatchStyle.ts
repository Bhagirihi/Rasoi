import { colors } from '@/constants/theme';

export type RecipeMatchStyle = {
  color: string;
  softBg: string;
  heroBg: string;
};

/** Consistent pantry-match colors across Home pick and Plan cards. */
export function getRecipeMatchStyle(
  percent: number,
  mutedFallback = colors.muted,
): RecipeMatchStyle {
  if (percent >= 70) {
    return {
      color: colors.green,
      softBg: 'rgba(0,168,107,0.12)',
      heroBg: 'rgba(0,168,107,0.92)',
    };
  }
  if (percent >= 40) {
    return {
      color: colors.primary,
      softBg: 'rgba(255,107,53,0.12)',
      heroBg: 'rgba(255,107,53,0.92)',
    };
  }
  return {
    color: mutedFallback,
    softBg: 'rgba(26,26,46,0.06)',
    heroBg: 'rgba(26,26,46,0.72)',
  };
}
