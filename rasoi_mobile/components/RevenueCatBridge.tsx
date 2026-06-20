import { useEffect } from 'react';

import { getConfiguredPaymentProviderId } from '@/constants/payments';
import { useAppContext } from '@/context/AppContext';
import { configureRevenueCat, syncRevenueCatUser } from '@/services/payments/revenueCatClient';

/** Configures RevenueCat and links the Rasoi user id for restore / analytics. */
export default function RevenueCatBridge() {
  const { isLoggedIn, userId } = useAppContext();

  useEffect(() => {
    if (getConfiguredPaymentProviderId() !== 'revenuecat') return;
    void configureRevenueCat().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (getConfiguredPaymentProviderId() !== 'revenuecat') return;
    void syncRevenueCatUser(isLoggedIn && userId ? userId : null).catch(() => undefined);
  }, [isLoggedIn, userId]);

  return null;
}
