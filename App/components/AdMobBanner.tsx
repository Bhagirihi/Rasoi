import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { getAdMobBannerUnitId } from '@/constants/admob';
import { isAdMobNativeAvailable } from '@/utils/admob';

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

export default function AdMobBanner({ placement, onVisibilityChange }: AdMobBannerProps) {
  const { showAds } = useAppContext();
  const { colors: themeColors, isDark } = useTheme();
  const [adsModule, setAdsModule] = useState<BannerModule | null>(null);
  const [adFailed, setAdFailed] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (!showAds || !isAdMobNativeAvailable()) {
      onVisibilityChange?.(false);
      return;
    }

    let cancelled = false;

    // NOTE: Metro can evaluate a dynamically-imported native module
    // synchronously (importAll), so a missing native module throws out of the
    // import() call itself — a .catch() on the promise cannot catch that.
    // The try/catch around await import() catches both the synchronous throw
    // and a rejected import, so Expo Go never red-screens on ads.
    const loadAdsModule = async () => {
      try {
        const mod = await import('react-native-google-mobile-ads');
        if (!cancelled) {
          setAdsModule({
            BannerAd: mod.BannerAd,
            BannerAdSize: mod.BannerAdSize,
          });
        }
      } catch {
        if (!cancelled) setAdsModule(null);
      }
    };

    void loadAdsModule();

    return () => {
      cancelled = true;
      onVisibilityChange?.(false);
    };
  }, [showAds, onVisibilityChange]);

  useEffect(() => {
    setAdFailed(false);
    setAdLoaded(false);
    onVisibilityChange?.(false);
  }, [placement, showAds, onVisibilityChange]);

  if (!showAds || Platform.OS === 'web' || !isAdMobNativeAvailable() || adFailed) {
    return null;
  }

  if (!adsModule) {
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
        unitId={getAdMobBannerUnitId(Platform.OS, placement)}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdLoaded={() => {
          setAdLoaded(true);
          onVisibilityChange?.(true);
        }}
        onAdFailedToLoad={() => {
          setAdFailed(true);
          onVisibilityChange?.(false);
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
  wrapHidden: {
    height: 0,
    marginVertical: 0,
    borderWidth: 0,
    opacity: 0,
  },
});

