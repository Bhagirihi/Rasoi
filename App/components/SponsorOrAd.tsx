import AdMobBanner from '@/components/AdMobBanner';
import SponsorPitchLink from '@/components/SponsorPitchLink';
import SponsorRail from '@/components/SponsorRail';
import type { SponsorCardData } from '@/services/sponsors';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { logSponsorEvent } from '@/services/sponsorEvents';
import { isAdMobNativeAvailable } from '@/utils/admob';

type SponsorOrAdProps = {
  sponsor: SponsorCardData | null;
  placement: string;
  compact?: boolean;
  /** Wait for sponsor fetch before showing the AdMob fallback. */
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Defer the ad request until the slot is on-screen (e.g. in-feed / below fold). */
  lazyLoad?: boolean;
  /** Required when lazyLoad is true — parent reports row visibility. */
  isViewable?: boolean;
};

export default function SponsorOrAd({
  sponsor,
  placement,
  compact = false,
  loading = false,
  style,
  lazyLoad = false,
  isViewable = true,
}: SponsorOrAdProps) {
  const { showAds, userCity } = useAppContext();
  const [adVisible, setAdVisible] = useState(false);
  const [adResolved, setAdResolved] = useState(false);
  const loggedImpressionRef = useRef<string | null>(null);

  const handleAdVisibility = useCallback((visible: boolean) => {
    setAdVisible(visible);
    setAdResolved(true);
  }, []);

  useEffect(() => {
    setAdVisible(false);
    setAdResolved(false);
  }, [placement, sponsor?.id]);

  useEffect(() => {
    if (!sponsor) return;
    const key = `${sponsor.id}:${placement}`;
    if (loggedImpressionRef.current === key) return;
    loggedImpressionRef.current = key;

    void logSponsorEvent({
      eventType: 'impression',
      brandName: sponsor.brandName,
      placement,
      sponsorId: sponsor.id,
      city: userCity ?? undefined,
    });
  }, [placement, sponsor, userCity]);

  if (loading) return null;

  if (sponsor) {
    return (
      <View style={style}>
        <Text style={styles.sponsoredLabel}>Sponsored</Text>
        <SponsorRail
          brandName={sponsor.brandName}
          productLabel={sponsor.productLabel}
          tagline={sponsor.tagline}
          logoUrl={sponsor.logoUrl}
          cta={sponsor.cta}
          searchQuery={sponsor.searchQuery}
          placement={placement}
          sponsorId={sponsor.id}
          compact={compact}
        />
      </View>
    );
  }

  const canShowAd =
    showAds && Platform.OS !== 'web' && isAdMobNativeAvailable();

  if (!canShowAd) return null;
  if (adResolved && !adVisible) return null;

  const shouldMountAd = !lazyLoad || isViewable;
  if (!shouldMountAd) return null;

  return (
    <View style={style}>
      <AdMobBanner placement={placement} onVisibilityChange={handleAdVisibility} />
      {adVisible ? (
        <View style={styles.pitchWrap}>
          <SponsorPitchLink />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sponsoredLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#9A8F84',
    marginBottom: spacing.xs,
  },
  pitchWrap: {
    marginTop: spacing.xs,
  },
});
