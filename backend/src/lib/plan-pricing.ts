import {
  RASOI_PLUS_MONTHLY_PLAY_PRODUCT_ID,
  RASOI_PLUS_MONTHLY_PRODUCT_ID,
  RASOI_PLUS_YEARLY_PLAY_PRODUCT_ID,
  RASOI_PLUS_YEARLY_PRODUCT_ID,
} from '@/lib/billing-products';

/** In-app free trial length before optional promo extensions. */
export const TRIAL_DURATION_DAYS = 15;

export const PAID_PLAN_MONTHLY_AMOUNT_INR = 49;

/** Marketing/list price shown in app copy. */
export const PAID_PLAN_YEARLY_AMOUNT_INR = 499;

/** Google Play base plan price (androidpublisher API). Checkout uses this for % discounts. */
export const PLAY_YEARLY_BASE_AMOUNT_INR = 500;

export const YEARLY_PROMO_OFFER_TAG = 'promo-yearly-5';
export const YEARLY_PROMO_PLAY_OFFER_ID = 'yearly-promo-5pct';
export const YEARLY_PROMO_RC_IGNORE_TAG = 'rc-ignore-offer';
export const YEARLY_PROMO_DISCOUNT_PERCENT = 5;

/** First-year price after Play offer (5% off ₹500). */
export const YEARLY_PROMO_AMOUNT_INR = Math.round(
  PLAY_YEARLY_BASE_AMOUNT_INR * (1 - YEARLY_PROMO_DISCOUNT_PERCENT / 100),
);

export const PAID_PLAN_YEARLY_IF_PAID_MONTHLY_INR = PAID_PLAN_MONTHLY_AMOUNT_INR * 12;
export const PAID_PLAN_YEARLY_SAVINGS_INR =
  PAID_PLAN_YEARLY_IF_PAID_MONTHLY_INR - PAID_PLAN_YEARLY_AMOUNT_INR;
export const PAID_PLAN_YEARLY_SAVINGS_PERCENT = Math.round(
  (PAID_PLAN_YEARLY_SAVINGS_INR / PAID_PLAN_YEARLY_IF_PAID_MONTHLY_INR) * 100,
);
export const PAID_PLAN_YEARLY_MONTHLY_EQUIV_INR = Math.round(PAID_PLAN_YEARLY_AMOUNT_INR / 12);

export type BillingPlanProduct = {
  productId: string;
  playProductId: string;
  amountInr: number;
  interval: 'monthly' | 'yearly';
  label: string;
};

export type YearlyPromoConfig = {
  offerTag: string;
  playOfferId: string;
  rcIgnoreOfferTag: string;
  discountPercent: number;
  /** Amount charged at Google Play checkout when offer is applied. */
  checkoutAmountInr: number;
  /** Marketing copy amount (5% off list ₹499). */
  displayAmountInr: number;
  playBaseAmountInr: number;
  renewalAmountInr: number;
};

export type BillingPlansCatalog = {
  trialDurationDays: number;
  products: {
    monthly: BillingPlanProduct;
    yearly: BillingPlanProduct;
  };
  yearlyPromo: YearlyPromoConfig;
  promoRules: {
    trialExtend: {
      kind: 'trial_extend';
      description: string;
      requiresActiveTrial: true;
    };
    yearlyDiscount: {
      kind: 'yearly_discount';
      description: string;
      requiresPaidPlan: false;
    };
  };
};

export function getTrialTotalDays(trialBonusDays = 0): number {
  return TRIAL_DURATION_DAYS + Math.max(0, trialBonusDays);
}

export function resolveYearlyPromoAmountInr(yearlyPromoOfferTag: string | null | undefined): number | null {
  if (yearlyPromoOfferTag === YEARLY_PROMO_OFFER_TAG) {
    return YEARLY_PROMO_AMOUNT_INR;
  }
  return null;
}

export function getBillingPlansCatalog(): BillingPlansCatalog {
  return {
    trialDurationDays: TRIAL_DURATION_DAYS,
    products: {
      monthly: {
        productId: RASOI_PLUS_MONTHLY_PRODUCT_ID,
        playProductId: RASOI_PLUS_MONTHLY_PLAY_PRODUCT_ID,
        amountInr: PAID_PLAN_MONTHLY_AMOUNT_INR,
        interval: 'monthly',
        label: 'Rasoi Plus Monthly',
      },
      yearly: {
        productId: RASOI_PLUS_YEARLY_PRODUCT_ID,
        playProductId: RASOI_PLUS_YEARLY_PLAY_PRODUCT_ID,
        amountInr: PAID_PLAN_YEARLY_AMOUNT_INR,
        interval: 'yearly',
        label: 'Rasoi Plus Yearly',
      },
    },
    yearlyPromo: {
      offerTag: YEARLY_PROMO_OFFER_TAG,
      playOfferId: YEARLY_PROMO_PLAY_OFFER_ID,
      rcIgnoreOfferTag: YEARLY_PROMO_RC_IGNORE_TAG,
      discountPercent: YEARLY_PROMO_DISCOUNT_PERCENT,
      checkoutAmountInr: YEARLY_PROMO_AMOUNT_INR,
      displayAmountInr: Math.round(
        PAID_PLAN_YEARLY_AMOUNT_INR * (1 - YEARLY_PROMO_DISCOUNT_PERCENT / 100),
      ),
      playBaseAmountInr: PLAY_YEARLY_BASE_AMOUNT_INR,
      renewalAmountInr: PAID_PLAN_YEARLY_AMOUNT_INR,
    },
    promoRules: {
      trialExtend: {
        kind: 'trial_extend',
        description: 'Adds bonus days to an active in-app trial (not a Play subscription trial).',
        requiresActiveTrial: true,
      },
      yearlyDiscount: {
        kind: 'yearly_discount',
        description:
          'Unlocks the developer-determined Play offer at yearly checkout. Redeem in app, then subscribe to yearly.',
        requiresPaidPlan: false,
      },
    },
  };
}
