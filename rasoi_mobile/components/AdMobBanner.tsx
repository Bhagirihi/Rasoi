import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { isAdMobNativeAvailable } from '@/utils/admob';

const TEST_BANNER_ID =
  Platform.OS === 'ios'
    ? 'ca-app-pub-3940256099942544/2934735716'
    : 'ca-app-pub-3940256099942544/6300978111';

type BannerModule = {
  BannerAd: React.ComponentType<{
    unitId: string;
    size: string;
    requestOptions?: { requestNonPersonalizedAdsOnly?: boolean };
  }>;
  BannerAdSize: { ANCHORED_ADAPTIVE_BANNER: string };
};

interface AdMobBannerProps {
  placement?: string;
}

export default function AdMobBanner({ placement }: AdMobBannerProps) {
  const { showAds } = useAppContext();
  const { colors: themeColors, isDark } = useTheme();
  const [adsModule, setAdsModule] = useState<BannerModule | null>(null);

  useEffect(() => {
    if (!showAds || !isAdMobNativeAvailable()) return;

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
      .catch(() => {
        if (!cancelled) setAdsModule(null);
      });

    return () => {
      cancelled = true;
    };
  }, [showAds]);

  if (!showAds || Platform.OS === 'web') {
    return null;
  }

  const adBorder = isDark ? 'rgba(255,255,255,0.28)' : themeColors.border;
  const adBorderWidth = isDark ? 1.5 : 1;

  if (!isAdMobNativeAvailable()) {
    return (
      <View
        style={[
          styles.placeholder,
          {
            backgroundColor: themeColors.white,
            borderColor: adBorder,
            borderWidth: adBorderWidth,
          },
        ]}
      >
        <Text style={[styles.placeholderLabel, { color: themeColors.muted }]}>Ad · {placement ?? 'banner'}</Text>
        <Text style={[styles.placeholderSub, { color: themeColors.placeholder }]}>
          Ads show in your APK build (not in Expo Go)
        </Text>
      </View>
    );
  }

  if (!adsModule) {
    return null;
  }

  const { BannerAd, BannerAdSize } = adsModule;

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: themeColors.white,
          borderColor: adBorder,
          borderWidth: adBorderWidth,
        },
      ]}
    >
      <BannerAd
        unitId={TEST_BANNER_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginVertical: spacing.md,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  placeholder: {
    marginVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  placeholderLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  placeholderSub: {
    marginTop: 4,
    fontSize: 11,
    color: colors.placeholder,
    textAlign: 'center',
  },
});
