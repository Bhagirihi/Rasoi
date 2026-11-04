import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAppContext } from '@/context/AppContext';
import { fetchActiveAnnouncement } from '@/services/announcements';
import { setAnnouncementModalActive } from '@/utils/announcementModalGate';
import { markAnnouncementSeen, wasAnnouncementSeen } from '@/utils/announcementStorage';
import {
  announcementShowsBanner,
  announcementShowsModal,
  openAnnouncementCta,
  type HomeAnnouncement,
} from '@/utils/announcements';

function useTrialExpiredPaywallWouldShow(): boolean {
  const {
    isHydrated,
    isLoggedIn,
    hasCompletedOnboarding,
    paymentsEnabled,
    showPaywall,
    trialExpired,
    effectiveTier,
  } = useAppContext();

  return (
    isHydrated &&
    isLoggedIn &&
    hasCompletedOnboarding &&
    paymentsEnabled &&
    showPaywall &&
    trialExpired &&
    effectiveTier === 'free'
  );
}

export function useHomeAnnouncement() {
  const router = useRouter();
  const {
    isHydrated,
    hasCompletedOnboarding,
    pendingEmailVerification,
    emailVerificationModalVisible,
  } = useAppContext();
  const trialExpiredBlocked = useTrialExpiredPaywallWouldShow();

  const [announcement, setAnnouncement] = useState<HomeAnnouncement | null>(null);
  const [seen, setSeen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [ready, setReady] = useState(false);

  const higherPriorityBlocking =
    Boolean(pendingEmailVerification) || emailVerificationModalVisible || trialExpiredBlocked;

  useEffect(() => {
    if (!isHydrated || !hasCompletedOnboarding) {
      setAnnouncement(null);
      setReady(true);
      return;
    }

    let cancelled = false;

    const load = async (force = false) => {
      const active = await fetchActiveAnnouncement(force);
      if (cancelled) {
        setReady(true);
        return;
      }

      if (!active) {
        setAnnouncement(null);
        setSeen(false);
        setReady(true);
        return;
      }

      const alreadySeen = await wasAnnouncementSeen(active.campaignKey);
      if (cancelled) return;

      setAnnouncement(active);
      setSeen(alreadySeen);
      setReady(true);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [isHydrated, hasCompletedOnboarding]);

  useFocusEffect(
    useCallback(() => {
      if (!isHydrated || !hasCompletedOnboarding) return;
      void fetchActiveAnnouncement(true).then(async (active) => {
        if (!active) {
          setAnnouncement(null);
          setSeen(false);
          return;
        }
        const alreadySeen = await wasAnnouncementSeen(active.campaignKey);
        setAnnouncement(active);
        setSeen(alreadySeen);
        setReady(true);
      });
    }, [isHydrated, hasCompletedOnboarding]),
  );

  const supportsModal = Boolean(announcement && announcementShowsModal(announcement.presentation));
  const supportsBanner = Boolean(announcement && announcementShowsBanner(announcement.presentation));

  const showModal =
    ready && Boolean(announcement) && !seen && !higherPriorityBlocking && supportsModal;

  const showBanner = ready && Boolean(announcement) && !seen && supportsBanner;

  useEffect(() => {
    if (!showModal || !announcement) {
      setModalVisible(false);
      setAnnouncementModalActive(false);
      return;
    }

    const timer = setTimeout(() => {
      setModalVisible(true);
      setAnnouncementModalActive(true);
    }, 700);

    return () => {
      clearTimeout(timer);
      setAnnouncementModalActive(false);
    };
  }, [showModal, announcement?.campaignKey]);

  useEffect(() => {
    if (!modalVisible) {
      setAnnouncementModalActive(false);
    }
  }, [modalVisible]);

  const dismiss = useCallback(async () => {
    if (!announcement) return;
    await markAnnouncementSeen(announcement.campaignKey);
    setSeen(true);
    setModalVisible(false);
    setAnnouncementModalActive(false);
  }, [announcement]);

  const handleCta = useCallback(async () => {
    if (!announcement?.ctaLink) return;
    await openAnnouncementCta(announcement.ctaLink, (href) => router.push(href));
    await dismiss();
  }, [announcement, dismiss, router]);

  return useMemo(
    () => ({
      announcement,
      showBanner,
      modalVisible,
      dismiss,
      handleCta,
    }),
    [announcement, showBanner, modalVisible, dismiss, handleCta],
  );
}


