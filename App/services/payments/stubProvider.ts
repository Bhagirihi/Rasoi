import type { PaymentProvider, PurchaseRequest, PurchaseResult } from '@/services/payments/types';

export const stubPaymentProvider: PaymentProvider = {
  id: 'stub',
  supportsRestore: false,

  async purchase(request: PurchaseRequest): Promise<PurchaseResult> {
    return {
      success: true,
      provider: 'stub',
      productId: request.productId,
      transactionId: `stub_${Date.now()}`,
    };
  },

  async restorePurchases(): Promise<PurchaseResult> {
    return {
      success: false,
      provider: 'stub',
      errorMessage: 'Restore is available after App Store or Play billing is connected.',
    };
  },
};
