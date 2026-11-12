import AdMobBanner from '@/components/AdMobBanner';
import SponsorPitchLink from '@/components/SponsorPitchLink';
import SponsorRail from '@/components/SponsorRail';
import type { SponsorCardData } from '@/services/sponsors';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Platform, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { spacing } from '@/constants/theme';
import { getAdMobBannerUnitId } from '@/constants/admob';
import { useAppContext } from '@/context/AppContext';
import { logFirebaseEvent } from '@/utils/firebase';
import { addSentryBreadcrumb, captureMessage } from '@/utils/sentry';
import { logSponsorEvent } from '@/services/sponsorEvents';
import { isAdMobNativeAvailable } from '@/utils/admob';

/**
 * One automatic reload after the first banner failure (fill / network blip).
 * The retry lives in THIS parent — not in AdMobBanner — because a failed
 * banner is unmounted here, which would clear a child-owned timer before it
 * fires (the one-shot slot death). Bumping `adAttempt` remounts AdMobBanner
 * with a fresh load; the timer survives because this component stays mounted.
 */
const AD_RETRY_DELAY_MS = 2500;

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

function adErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message.slice(0, 180);
  if (typeof error === 'string') return error.slice(0, 180);
  return 'unknown';
}

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
  /**
   * Final decision reached: an ad loaded, or the single retry was used and it
   * failed again. Only then is the slot hidden. A bare `false` from
   * onVisibilityChange is NOT a decision — it also fires on unmount / before
   * the SDK is ready — so it must never hide the slot on its own.
   */
  const [adSettled, setAdSettled] = useState(false);
  /** 1-based load attempt; bumped to remount AdMobBanner for the single retry. */
  const [adAttempt, setAdAttempt] = useState(1);
  /** True while the retry delay is running — render nothing, stay mounted. */
  const [retryPending, setRetryPending] = useState(false);
  const loggedImpressionRef = useRef<string | null>(null);
  const retryUsedRef = useRef(false);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptRef = useRef(1);
  const loggedLoadedAttemptRef = useRef(0);

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  const handleAdVisibility = useCallback(
    (visible: boolean) => {
      if (!visible) {
        // Not a failure by itself (unmount / SDK not ready yet). The real
        // failure signal is onAdFailedToLoad, which decides retry vs give up.
        setAdVisible(false);
        return;
      }

      setAdVisible(true);
      setAdSettled(true);
      clearRetryTimer();
      if (loggedLoadedAttemptRef.current !== attemptRef.current) {
        loggedLoadedAttemptRef.current = attemptRef.current;
        void logFirebaseEvent('admob_banner_loaded', {
          placement,
          attempt: attemptRef.current,
          unit_suffix: getAdMobBannerUnitId(Platform.OS, placement).slice(-12),
        });
      }
    },
    [clearRetryTimer, placement],
  );

  const handleAdFailedToLoad = useCallback(
    (error: Error) => {
      const attempt = attemptRef.current;
      const message = adErrorMessage(error);
      const unitId = getAdMobBannerUnitId(Platform.OS, placement);
      const willRetry = !retryUsedRef.current;

      addSentryBreadcrumb('admob_banner_failed', 'admob', {
        placement,
        unitId,
        attempt,
        willRetry,
        message,
      });
      void logFirebaseEvent('admob_banner_failed', {
        placement,
        attempt,
        will_retry: willRetry ? 1 : 0,
        // Keep unit id short for Analytics param limits
        unit_suffix: unitId.slice(-12),
      });

      if (!willRetry) {
        // Second failure — give up and hide the slot for this placement.
        setAdVisible(false);
        setAdSettled(true);
        captureMessage(`admob_banner_failed: ${placement}`, 'warning');
        return;
      }

      retryUsedRef.current = true;
      setAdVisible(false);
      setRetryPending(true);
      clearRetryTimer();
      retryTimerRef.current = setTimeout(() => {
        retryTimerRef.current = null;
        attemptRef.current += 1;
        setAdAttempt(attemptRef.current);
        setRetryPending(false);
      }, AD_RETRY_DELAY_MS);
    },
    [clearRetryTimer, placement],
  );

  const resetAttempts = useCallback(() => {
    clearRetryTimer();
    retryUsedRef.current = false;
    attemptRef.current = 1;
    loggedLoadedAttemptRef.current = 0;
    setAdVisible(false);
    setAdSettled(false);
    setRetryPending(false);
    setAdAttempt(1);
  }, [clearRetryTimer]);

  useEffect(() => {
    resetAttempts();
  }, [placement, sponsor?.id, resetAttempts]);

  /**
   * Self-heal: after the single retry fails, the slot stays hidden for the
   * session (tabs keep this screen mounted, so the placement/sponsor reset
   * above never fires). When the user comes back to this screen, try again —
   * but only if the slot previously gave up without showing an ad, so a
   * visible ad is never reloaded.
   */
  useFocusEffect(
    useCallback(() => {
      if (adSettled && !adVisible) resetAttempts();
    }, [adSettled, adVisible, resetAttempts]),
  );

  useEffect(() => () => clearRetryTimer(), [clearRetryTimer]);

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
  if (adSettled && !adVisible) return null;
  if (retryPending) return null;

  const shouldMountAd = !lazyLoad || isViewable;
  if (!shouldMountAd) return null;

  return (
    <View style={style}>
      <AdMobBanner
        key={`${placement}-${adAttempt}`}
        placement={placement}
        onVisibilityChange={handleAdVisibility}
        onAdFailedToLoad={handleAdFailedToLoad}
      />
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
