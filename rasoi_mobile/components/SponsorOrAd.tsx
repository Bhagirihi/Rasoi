import AdMobBanner from '@/components/AdMobBanner';
import SponsorPitchLink from '@/components/SponsorPitchLink';
import SponsorRail from '@/components/SponsorRail';
import type { SponsorCardData } from '@/services/sponsors';
import { useCallback, useState } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { isAdMobNativeAvailable } from '@/utils/admob';

type SponsorOrAdProps = {
  sponsor: SponsorCardData | null;
  placement: string;
  compact?: boolean;
  /** Wait for sponsor fetch before showing the AdMob fallback. */
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function SponsorOrAd({
  sponsor,
  placement,
  compact = false,
  loading = false,
  style,
}: SponsorOrAdProps) {
  const { showAds } = useAppContext();
  const [adVisible, setAdVisible] = useState(false);
  const [adResolved, setAdResolved] = useState(false);

  const handleAdVisibility = useCallback((visible: boolean) => {
    setAdVisible(visible);
    setAdResolved(true);
  }, []);

  if (loading) return null;

  if (sponsor) {
    return (
      <View style={style}>
        <SponsorRail {...sponsor} compact={compact} />
      </View>
    );
  }

  const canShowAd =
    showAds && Platform.OS !== 'web' && isAdMobNativeAvailable();

  if (!canShowAd) return null;

  if (adResolved && !adVisible) return null;

  if (!adResolved) {
    return (
      <AdMobBanner placement={placement} onVisibilityChange={handleAdVisibility} />
    );
  }

  return (
    <View style={style}>
      <AdMobBanner placement={placement} onVisibilityChange={handleAdVisibility} />
      <View style={styles.pitchWrap}>
        <SponsorPitchLink />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pitchWrap: {
    marginTop: spacing.xs,
  },
});
