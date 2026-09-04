import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { getAdMobBannerUnitId } from '@/constants/admob';
import { isAdMobNativeAvailable } from '@/utils/admob';
import { logFirebaseEvent } from '@/utils/firebase';
import { addSentryBreadcrumb, captureMessage } from '@/utils/sentry';

/** One automatic remount after the first load failure (fill / network blip). */
const AD_RETRY_DELAY_MS = 2500;

type BannerModule = {
  BannerAd: React.ComponentType<{
    unitId: string;
    size: string;
    requestOptions?: { requestNonPersonalizedAdsOnly?: boolean };
    onAdLoaded?: (dimensions: { width: number; height: number }) => void;
    onAdFailedToLoad?: (error: Error) => void;
  }>;
  BannerAdSize: { ANCHORED_ADAPTIVE_BANNER: string };
};

interface AdMobBannerProps {
  placement?: string;
  onVisibilityChange?: (visible: boolean) => void;
}

function adErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message.slice(0, 180);
  if (typeof error === 'string') return error.slice(0, 180);
  return 'unknown';
}

export default function AdMobBanner({ placement, onVisibilityChange }: AdMobBannerProps) {
  const { showAds } = useAppContext();
  const { colors: themeColors, isDark } = useTheme();
  const [adsModule, setAdsModule] = useState<BannerModule | null>(null);
  const [adFailed, setAdFailed] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  /** True while waiting to remount after the first failure. */
  const [retryPending, setRetryPending] = useState(false);
  /** Bumps to remount BannerAd for a single retry. */
  const [loadAttempt, setLoadAttempt] = useState(0);
  const retryUsedRef = useRef(false);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const unitId = getAdMobBannerUnitId(Platform.OS, placement);
  const placementKey = placement ?? 'home';

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  const reportAdFailure = useCallback(
    (error: unknown, attempt: number, willRetry: boolean) => {
      const message = adErrorMessage(error);
      addSentryBreadcrumb('admob_banner_failed', 'admob', {
        placement: placementKey,
        unitId,
        attempt,
        willRetry,
        message,
      });
      void logFirebaseEvent('admob_banner_failed', {
        placement: placementKey,
        attempt,
        will_retry: willRetry ? 1 : 0,
        // Keep unit id short for Analytics param limits
        unit_suffix: unitId.slice(-12),
      });
      if (!willRetry) {
        captureMessage(`admob_banner_failed: ${placementKey}`, 'warning');
      }
      if (__DEV__) {
        console.warn('[AdMob]', placementKey, `attempt=${attempt}`, willRetry ? 'retrying' : 'giving up', message);
      }
    },
    [placementKey, unitId],
  );

  useEffect(() => {
    if (!showAds || !isAdMobNativeAvailable()) {
      onVisibilityChange?.(false);
      return;
    }

    let cancelled = false;

    void import('react-native-google-mobile-ads')
      .then((mod) => {
        if (!cancelled) {
          setAdsModule({
            BannerAd: mod.BannerAd,
            BannerAdSize: mod.BannerAdSize,
          });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setAdsModule(null);
          reportAdFailure(error, 0, false);
          onVisibilityChange?.(false);
        }
      });

    return () => {
      cancelled = true;
      onVisibilityChange?.(false);
    };
  }, [showAds, onVisibilityChange, reportAdFailure]);

  useEffect(() => {
    clearRetryTimer();
    retryUsedRef.current = false;
    setAdFailed(false);
    setAdLoaded(false);
    setRetryPending(false);
    setLoadAttempt(0);
    onVisibilityChange?.(false);
  }, [placement, showAds, onVisibilityChange, clearRetryTimer]);

  useEffect(() => () => clearRetryTimer(), [clearRetryTimer]);

  const handleAdFailedToLoad = useCallback(
    (error: Error) => {
      const attempt = loadAttempt + 1;
      const canRetry = !retryUsedRef.current;

      if (canRetry) {
        retryUsedRef.current = true;
        reportAdFailure(error, attempt, true);
        setAdLoaded(false);
        setRetryPending(true);
        onVisibilityChange?.(false);
        clearRetryTimer();
        retryTimerRef.current = setTimeout(() => {
          setRetryPending(false);
          setLoadAttempt((value) => value + 1);
        }, AD_RETRY_DELAY_MS);
        return;
      }

      reportAdFailure(error, attempt, false);
      setRetryPending(false);
      setAdFailed(true);
      onVisibilityChange?.(false);
    },
    [clearRetryTimer, loadAttempt, onVisibilityChange, reportAdFailure],
  );

  if (!showAds || Platform.OS === 'web' || !isAdMobNativeAvailable() || adFailed) {
    return null;
  }

  if (!adsModule || retryPending) {
    return null;
  }

  const adBorder = isDark ? 'rgba(255,255,255,0.28)' : themeColors.border;
  const adBorderWidth = isDark ? 1.5 : 1;

  const { BannerAd, BannerAdSize } = adsModule;

  return (
    <View
      style={[
        styles.wrap,
        !adLoaded && styles.wrapHidden,
        {
          backgroundColor: themeColors.white,
          borderColor: adBorder,
          borderWidth: adBorderWidth,
        },
      ]}
    >
      <BannerAd
        key={`${placementKey}-${unitId}-${loadAttempt}`}
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdLoaded={() => {
          clearRetryTimer();
          setAdLoaded(true);
          onVisibilityChange?.(true);
          void logFirebaseEvent('admob_banner_loaded', {
            placement: placementKey,
            attempt: loadAttempt + 1,
            unit_suffix: unitId.slice(-12),
          });
        }}
        onAdFailedToLoad={handleAdFailedToLoad}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginVertical: spacing.sm,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  wrapHidden: {
    height: 0,
    marginVertical: 0,
    borderWidth: 0,
    opacity: 0,
  },
});
