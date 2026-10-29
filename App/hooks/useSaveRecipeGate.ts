import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
import { savedRecipeLimitCopy } from '@/utils/planLimitCopy';
import { PAYWALL_HREF } from '@/utils/routes';

export function useSaveRecipeGate() {
  const router = useRouter();
  const { showDialog } = useAppDialog();
  const { toggleSavedRecipe, planLimits, showPaywall } = useAppContext();

  const trySaveRecipe = useCallback(
    (recipeId: string): boolean => {
      const ok = toggleSavedRecipe(recipeId);
      if (!ok && showPaywall) {
        const copy = savedRecipeLimitCopy(planLimits.savedRecipeLimit);
        showDialog({
          title: copy.title,
          message: copy.message,
          buttons: [
            { text: 'Not now', style: 'cancel' },
            { text: 'Upgrade', onPress: () => router.push(PAYWALL_HREF) },
          ],
        });
      }
      return ok;
    },
    [planLimits.savedRecipeLimit, router, showDialog, showPaywall, toggleSavedRecipe],
  );

  return { trySaveRecipe };
}
