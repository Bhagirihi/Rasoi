import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
import {
  allergyFilterCopy,
  homeShuffleLockedCopy,
  lockedPlanDayCopy,
  partnerCheckoutLimitCopy,
  planShuffleLockedCopy,
  savedRecipeLimitCopy,
  shuffleDailyLimitCopy,
} from '@/utils/planLimitCopy';
import { canUseShuffle, recordShuffle } from '@/utils/shuffleQuota';
import { PAYWALL_HREF } from '@/utils/routes';

type ShuffleKind = 'home' | 'plan';

function paywallButtons(
  router: ReturnType<typeof useRouter>,
  primaryLabel = 'See Rasoi Plus',
) {
  return [
    { text: 'Not now', style: 'cancel' as const },
    { text: primaryLabel, onPress: () => router.push(PAYWALL_HREF) },
  ];
}

export function usePlanLimitDialog() {
  const router = useRouter();
  const { showDialog } = useAppDialog();
  const { planLimits, showPaywall, effectiveTier } = useAppContext();

  const showSavedRecipeLimit = useCallback(() => {
    if (!showPaywall) return;
    const copy = savedRecipeLimitCopy(planLimits.savedRecipeLimit);
    showDialog({
      title: copy.title,
      message: copy.message,
      buttons: paywallButtons(router, 'Upgrade'),
    });
  }, [planLimits.savedRecipeLimit, router, showDialog, showPaywall]);

  const showLockedPlanDay = useCallback(() => {
    if (!showPaywall) return;
    const copy = lockedPlanDayCopy();
    showDialog({
      title: copy.title,
      message: copy.message,
      buttons: paywallButtons(router),
    });
  }, [router, showDialog, showPaywall]);

  const showAllergyFilterUpsell = useCallback(() => {
    if (!showPaywall) return;
    const copy = allergyFilterCopy();
    showDialog({
      title: copy.title,
      message: copy.message,
      buttons: paywallButtons(router),
    });
  }, [router, showDialog, showPaywall]);

  const showPartnerCheckoutLimit = useCallback(() => {
    if (!showPaywall) return;
    const copy = partnerCheckoutLimitCopy();
    showDialog({
      title: copy.title,
      message: copy.message,
      buttons: paywallButtons(router, 'View plans'),
    });
  }, [router, showDialog, showPaywall]);

  const showShuffleLocked = useCallback(
    (kind: ShuffleKind) => {
      if (!showPaywall) return;
      const copy = kind === 'home' ? homeShuffleLockedCopy() : planShuffleLockedCopy();
      showDialog({
        title: copy.title,
        message: copy.message,
        buttons: paywallButtons(router),
      });
    },
    [router, showDialog, showPaywall],
  );

  const tryShuffle = useCallback(
    async (kind: ShuffleKind, runShuffle: () => void | Promise<void>) => {
      const dailyLimit =
        kind === 'home' ? planLimits.homeShuffleDailyLimit : planLimits.planShuffleDailyLimit;

      if (dailyLimit === 0) {
        showShuffleLocked(kind);
        return;
      }

      const gate = await canUseShuffle(kind, dailyLimit);
      if (!gate.allowed) {
        if (showPaywall && dailyLimit !== null && gate.remaining === 0) {
          const copy = shuffleDailyLimitCopy(kind, effectiveTier, dailyLimit);
          showDialog({
            title: copy.title,
            message: copy.message,
            buttons: paywallButtons(router, 'Upgrade'),
          });
        }
        return;
      }

      if (dailyLimit !== null) {
        await recordShuffle(kind);
      }
      await runShuffle();
    },
    [
      effectiveTier,
      planLimits.homeShuffleDailyLimit,
      planLimits.planShuffleDailyLimit,
      router,
      showDialog,
      showPaywall,
      showShuffleLocked,
    ],
  );

  return {
    showSavedRecipeLimit,
    showLockedPlanDay,
    showAllergyFilterUpsell,
    showPartnerCheckoutLimit,
    tryShuffle,
  };
}
