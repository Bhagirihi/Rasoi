import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import type { Recipe } from '@/data/mockRecipes';
import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
import { offlineRecipeLimitCopy } from '@/utils/planLimitCopy';
import { PAYWALL_HREF } from '@/utils/routes';

export function useOfflineRecipeGate() {
  const router = useRouter();
  const { showDialog } = useAppDialog();
  const { toggleOfflineRecipe, planLimits, showPaywall, offlineRecipeIds } = useAppContext();

  const tryToggleOfflineRecipe = useCallback(
    (recipe: Recipe): boolean => {
      const ok = toggleOfflineRecipe(recipe);
      if (!ok) {
        const copy = offlineRecipeLimitCopy(
          planLimits.offlineRecipeLimit,
          offlineRecipeIds.length,
        );
        const canUpgrade =
          showPaywall &&
          (planLimits.offlineRecipeLimit === 0 || planLimits.offlineRecipeLimit === 5);

        showDialog({
          title: copy.title,
          message: copy.message,
          buttons: canUpgrade
            ? [
                { text: 'Not now', style: 'cancel' },
                { text: copy.ctaLabel, onPress: () => router.push(PAYWALL_HREF) },
              ]
            : [{ text: 'OK' }],
        });
      }
      return ok;
    },
    [
      offlineRecipeIds.length,
      planLimits.offlineRecipeLimit,
      router,
      showDialog,
      showPaywall,
      toggleOfflineRecipe,
    ],
  );

  return { tryToggleOfflineRecipe };
}
