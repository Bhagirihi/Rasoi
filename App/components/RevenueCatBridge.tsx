import Constants from 'expo-constants';
import { useEffect, useMemo } from 'react';

import { getConfiguredPaymentProviderId } from '@/constants/payments';
import type { PlanTier } from '@/constants/plans';
import type { DietChoice } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import {
  configureRevenueCat,
  syncRevenueCatUser,
  type RevenueCatSubscriberProfile,
} from '@/services/payments/revenueCatClient';

function buildRevenueCatProfile(input: {
  userEmail: string;
  userName: string;
  userPhone: string;
  userCity: string | null;
  userState: string | null;
  isGuest: boolean;
  effectiveTier: PlanTier;
  dietChoice: DietChoice;
  regionalCuisine: string;
}): RevenueCatSubscriberProfile {
  const appVersion = Constants.expoConfig?.version?.trim();

  return {
    email: input.userEmail,
    displayName: input.userName,
    phoneNumber: input.userPhone,
    attributes: {
      account_type: input.isGuest ? 'guest' : 'member',
      plan_tier: input.effectiveTier,
      city: input.userCity,
      state: input.userState,
      diet: input.dietChoice,
      region: input.regionalCuisine,
      app_version: appVersion || null,
      platform: Constants.platform?.ios ? 'ios' : Constants.platform?.android ? 'android' : null,
    },
  };
}

/** Configures RevenueCat and syncs Rasoi user id + subscriber attributes. */
export default function RevenueCatBridge() {
  const {
    isLoggedIn,
    userId,
    userEmail,
    userName,
    userPhone,
    userCity,
    userState,
    isGuest,
    effectiveTier,
    dietChoice,
    regionalCuisine,
  } = useAppContext();

  const profile = useMemo(
    () =>
      buildRevenueCatProfile({
        userEmail,
        userName,
        userPhone,
        userCity,
        userState,
        isGuest,
        effectiveTier,
        dietChoice,
        regionalCuisine,
      }),
    [
      dietChoice,
      effectiveTier,
      isGuest,
      regionalCuisine,
      userCity,
      userEmail,
      userName,
      userPhone,
      userState,
    ],
  );

  useEffect(() => {
    if (getConfiguredPaymentProviderId() !== 'revenuecat') return;
    void configureRevenueCat().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (getConfiguredPaymentProviderId() !== 'revenuecat') return;
    void syncRevenueCatUser(isLoggedIn && userId ? userId : null, profile).catch(() => undefined);
  }, [isLoggedIn, profile, userId]);

  return null;
}
