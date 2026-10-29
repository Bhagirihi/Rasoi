import type { PaymentProviderId, RasoiPlusCatalogProductId } from '@/constants/payments';
import type { UserProfileResponse } from '@/types/api';
import { authApiFetch } from '@/utils/api';

type BillingConfirmResponse = {
  provider: PaymentProviderId;
  productId?: string;
  transactionId: string;
  plan: UserProfileResponse['plan'];
};

export async function confirmBillingSubscription(input: {
  provider: PaymentProviderId;
  productId: RasoiPlusCatalogProductId;
  transactionId: string;
}): Promise<UserProfileResponse['plan']> {
  const data = await authApiFetch<BillingConfirmResponse>('/api/billing/confirm', {
    method: 'POST',
    body: JSON.stringify(input),
  });

  if (!data?.plan) {
    throw new Error('Unexpected billing confirmation response.');
  }

  return data.plan;
}
