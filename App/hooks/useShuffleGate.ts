import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
import {
  homeShuffleLockedCopy,
  planShuffleLockedCopy,
  shuffleDailyLimitCopy,
} from '@/utils/planLimitCopy';
import { canUseShuffle, recordShuffle } from '@/utils/shuffleQuota';
import { PAYWALL_HREF } from '@/utils/routes';

type ShuffleKind = 'home' | 'plan';

export function useShuffleGate(kind: ShuffleKind) {
  const router = useRouter();
  const { showDialog } = useAppDialog();
  const { planLimits, showPaywall, effectiveTier } = useAppContext();

  const dailyLimit =
    kind === 'home' ? planLimits.homeShuffleDailyLimit : planLimits.planShuffleDailyLimit;

  const tryShuffle = useCallback(
    async (runShuffle: () => void | Promise<void>) => {
      if (dailyLimit === 0) {
        if (showPaywall) {
          const copy = kind === 'home' ? homeShuffleLockedCopy() : planShuffleLockedCopy();
          showDialog({
            title: copy.title,
            message: copy.message,
            buttons: [
              { text: 'Not now', style: 'cancel' },
              { text: 'See Rasoi Plus', onPress: () => router.push(PAYWALL_HREF) },
            ],
          });
        }
        return;
      }

      const gate = await canUseShuffle(kind, dailyLimit);
      if (!gate.allowed) {
        if (showPaywall && dailyLimit !== null && gate.remaining === 0) {
          const copy = shuffleDailyLimitCopy(kind, effectiveTier, dailyLimit);
          showDialog({
            title: copy.title,
            message: copy.message,
            buttons: [
              { text: 'Not now', style: 'cancel' },
              { text: 'Upgrade', onPress: () => router.push(PAYWALL_HREF) },
            ],
          });
        }
        return;
      }

      if (dailyLimit !== null) {
        await recordShuffle(kind);
      }
      await runShuffle();
    },
    [dailyLimit, effectiveTier, kind, router, showDialog, showPaywall],
  );

  return { tryShuffle, dailyLimit };
}
