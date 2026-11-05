import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { getAdMobBannerUnitId } from '@/constants/admob';
import { isAdMobNativeAvailable, whenMobileAdsReady } from '@/utils/admob';

type BannerModule = {
  BannerAd: React.ComponentType<{
    unitId: string;
    size: string;
    requestOptions?: { requestNonPersonalizedAdsOnly?: boolean };
    onAdLoaded?: (dimensions: { width: number; height: number }) => void;
    onAdFailedToLoad?: (error: Error) => void;
  }>;
  BannerAdSize: {
    BANNER: string;
    ANCHORED_ADAPTIVE_BANNER: string;
    INLINE_ADAPTIVE_BANNER?: string;
  };
};

interface AdMobBannerProps {
  placement?: string;
  onVisibilityChange?: (visible: boolean) => void;
  /**
   * Called on every load failure (banner fill failure, or the ads module /
   * SDK failing to initialise). The parent owns the retry decision — this
   * banner must not own a retry timer, because a failed banner is unmounted
   * by SponsorOrAd and the timer would be cleared before it fires.
   */
  onAdFailedToLoad?: (error: Error) => void;
}

export default function AdMobBanner({
  placement,
  onVisibilityChange,
  onAdFailedToLoad,
}: AdMobBannerProps) {
  const { showAds } = useAppContext();
  const { colors: themeColors, isDark } = useTheme();
  const [adsModule, setAdsModule] = useState<BannerModule | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [adFailed, setAdFailed] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (!showAds || !isAdMobNativeAvailable()) {
      onVisibilityChange?.(false);
      return;
    }

    let cancelled = false;

    const loadAdsModule = async () => {
      try {
        await whenMobileAdsReady();
        if (cancelled) return;
        setSdkReady(true);

        const mod = await import('react-native-google-mobile-ads');
        if (!cancelled) {
          setAdsModule({
            BannerAd: mod.BannerAd,
            BannerAdSize: mod.BannerAdSize,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setAdsModule(null);
          setSdkReady(false);
          // SDK/module init failure is a load failure like any other — let
          // the parent decide whether to retry it.
          onAdFailedToLoad?.(error instanceof Error ? error : new Error(String(error)));
        }
      }
    };

    void loadAdsModule();

    return () => {
      cancelled = true;
      onVisibilityChange?.(false);
    };
  }, [showAds, onVisibilityChange, onAdFailedToLoad]);

  useEffect(() => {
    setAdFailed(false);
    setAdLoaded(false);
    onVisibilityChange?.(false);
  }, [placement, showAds, onVisibilityChange]);

  if (!showAds || Platform.OS === 'web' || !isAdMobNativeAvailable() || adFailed) {
    return null;
  }

  if (!sdkReady || !adsModule) {
    return null;
  }

  const adBorder = isDark ? 'rgba(255,255,255,0.28)' : themeColors.border;
  const adBorderWidth = isDark ? 1.5 : 1;

  const { BannerAd, BannerAdSize } = adsModule;
  // Fixed 320x50 — most reliable for in-ScrollView slots (anchored adaptive
  // expects a screen edge; inline adaptive needs an explicit max height).
  const unitId = getAdMobBannerUnitId(Platform.OS, placement);

  return (
    <View
      style={[
        styles.wrap,
        !adLoaded && styles.wrapLoading,
        {
          backgroundColor: themeColors.white,
          borderColor: adBorder,
          borderWidth: adLoaded ? adBorderWidth : 0,
        },
      ]}
    >
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.BANNER}
        onAdLoaded={() => {
          if (__DEV__) {
            console.log('[AdMob] banner loaded', { placement, unitId });
          }
          setAdLoaded(true);
          onVisibilityChange?.(true);
        }}
        onAdFailedToLoad={(error) => {
          if (__DEV__) {
            console.warn('[AdMob] banner failed', {
              placement,
              unitId,
              message: error?.message ?? String(error),
            });
          }
          setAdFailed(true);
          onVisibilityChange?.(false);
          onAdFailedToLoad?.(error);
        }}
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
  wrapLoading: {
    minHeight: 50,
    opacity: 0.01,
    marginVertical: 0,
  },
});
