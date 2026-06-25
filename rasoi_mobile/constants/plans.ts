export type PlanTier = 'free' | 'trial' | 'paid';

export type BillingInterval = 'monthly' | 'yearly';

export const TRIAL_DURATION_DAYS = 3;

export const PLAN_LABELS: Record<PlanTier, string> = {
  free: 'Free',
  trial: 'Trial',
  paid: 'Rasoi Plus',
};

export const PAID_PLAN_MONTHLY_PRICE = '₹49/month';
export const PAID_PLAN_YEARLY_PRICE = '₹499/year';

/** Raw INR amounts — single source for savings math */
export const PAID_PLAN_MONTHLY_AMOUNT_INR = 49;
export const PAID_PLAN_YEARLY_AMOUNT_INR = 499;
export const PAID_PLAN_YEARLY_MONTHLY_EQUIV_INR = 42;

export const PAID_PLAN_YEARLY_IF_PAID_MONTHLY_INR =
  PAID_PLAN_MONTHLY_AMOUNT_INR * 12;
export const PAID_PLAN_YEARLY_SAVINGS_INR =
  PAID_PLAN_YEARLY_IF_PAID_MONTHLY_INR - PAID_PLAN_YEARLY_AMOUNT_INR;
export const PAID_PLAN_YEARLY_SAVINGS_PERCENT = Math.round(
  (PAID_PLAN_YEARLY_SAVINGS_INR / PAID_PLAN_YEARLY_IF_PAID_MONTHLY_INR) * 100,
);

export function formatInr(amount: number): string {
  return `₹${amount}`;
}

export const PAID_PLAN_YEARLY_EQUIV = `${formatInr(PAID_PLAN_YEARLY_MONTHLY_EQUIV_INR)}/mo billed yearly`;
export const PAID_PLAN_YEARLY_SAVINGS_LABEL = `Save ${PAID_PLAN_YEARLY_SAVINGS_PERCENT}% · ${formatInr(PAID_PLAN_YEARLY_SAVINGS_INR)}/year`;
export const PAID_PLAN_YEARLY_DETAIL = `${formatInr(PAID_PLAN_YEARLY_AMOUNT_INR)}/year · ${formatInr(PAID_PLAN_YEARLY_MONTHLY_EQUIV_INR)}/mo · Save ${PAID_PLAN_YEARLY_SAVINGS_PERCENT}% (${formatInr(PAID_PLAN_YEARLY_SAVINGS_INR)})`;

export const YEARLY_PROMO_OFFER_TAG = 'promo-yearly-5';
export const YEARLY_PROMO_DISCOUNT_PERCENT = 5;
export const PAID_PLAN_YEARLY_PROMO_AMOUNT_INR = Math.round(
  PAID_PLAN_YEARLY_AMOUNT_INR * (1 - YEARLY_PROMO_DISCOUNT_PERCENT / 100),
);
export const PAID_PLAN_YEARLY_PROMO_LABEL = `${formatInr(PAID_PLAN_YEARLY_PROMO_AMOUNT_INR)}/year · ${YEARLY_PROMO_DISCOUNT_PERCENT}% promo applied`;

/** @deprecated Use PAID_PLAN_MONTHLY_PRICE */
export const PAID_PLAN_PRICE = PAID_PLAN_MONTHLY_PRICE;

export const PAID_PLAN_FEATURES = [
  'No ads anywhere in the app',
  'Blinkit, Zepto & Instamart grocery checkout',
  'Zomato & Swiggy food delivery links',
  'Keep partner access after trial ends',
] as const;

export const TRIAL_WELCOME_FEATURES = [
  'All Rasoi Plus partner checkouts unlocked',
  `Try grocery & delivery links free for ${TRIAL_DURATION_DAYS} days`,
  'Subscribe anytime to remove ads and keep access',
] as const;

export const PLAN_FEATURES = {
  free: {
    ads: true,
    partners: false,
    partnersTrialMode: false,
  },
  trial: {
    ads: true,
    partners: true,
    partnersTrialMode: true,
  },
  paid: {
    ads: false,
    partners: true,
    partnersTrialMode: false,
  },
} as const;

export const PARTNER_TRIAL_NOTE =
  'Included in Rasoi Plus — enjoy during your free trial';

export const PARTNER_PAID_NOTE = 'Included with Rasoi Plus';

export const FREE_PARTNER_SHOPS_PER_MONTH = 2;

export const FREE_PARTNER_FREEMIUM_NOTE =
  'Free plan includes 2 partner shops per month after your trial ends.';

export const FREE_PARTNER_UPSELL =
  'Upgrade to Rasoi Plus for unlimited Blinkit, Zepto, Instamart, Zomato & Swiggy checkout.';

export function getPlanPriceLabel(interval: BillingInterval): string {
  return interval === 'yearly' ? PAID_PLAN_YEARLY_PRICE : PAID_PLAN_MONTHLY_PRICE;
}
