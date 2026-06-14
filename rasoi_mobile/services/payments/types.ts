import type { PaymentProviderId } from '@/constants/payments';
import type { StoredPlanState } from '@/utils/planStorage';

export type PurchaseProductId = 'rasoi_plus_monthly' | 'rasoi_plus_yearly';

export interface PurchaseRequest {
  productId: PurchaseProductId;
}

export interface PurchaseResult {
  success: boolean;
  provider: PaymentProviderId;
  transactionId?: string;
  errorMessage?: string;
  cancelled?: boolean;
}

export interface PaymentProvider {
  id: PaymentProviderId;
  supportsRestore: boolean;
  purchase(request: PurchaseRequest): Promise<PurchaseResult>;
  restorePurchases(): Promise<PurchaseResult>;
}

export type PurchaseFlowResult =
  | { ok: true; planState: StoredPlanState }
  | { ok: false; error: string; cancelled?: boolean };

export interface ApplyPaidPlanOptions {
  isLoggedIn: boolean;
  trialStartedAt: string | null;
}
