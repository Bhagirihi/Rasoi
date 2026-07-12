export type PlanTier = 'free' | 'trial' | 'paid';

export type BillingInterval = 'monthly' | 'yearly';

export const TRIAL_DURATION_DAYS = 15;

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

export const PAYWALL_HERO_TITLE = 'Plan meals. Shop smarter. Cook ad-free.';

export const PAYWALL_HERO_SUB =
  'Full 3-day meal planner, unlimited saved recipes, and unlimited grocery & delivery checkout from Blinkit, Zepto, Instamart, Zomato & Swiggy.';

export const PAYWALL_PLUS_SUCCESS_MESSAGE =
  '3-day meal plan, unlimited saves, up to 30 offline downloads, unlimited partner checkout, and no ads are now active.';

export const PAYWALL_TRIAL_STARTED_MESSAGE = (days: number) =>
  `Full 3-day plan, unlimited partner checkout, and up to 25 saves for ${days} days. Subscribe anytime to keep everything ad-free.`;

export const PAYWALL_BENEFIT_HIGHLIGHTS = [
  {
    icon: 'calendar' as const,
    label: '3-day meal planner',
    sub: 'Today, Tomorrow & day after · unlimited shuffle on Plus',
  },
  {
    icon: 'bookmark' as const,
    label: 'Unlimited saved recipes',
    sub: 'Favourites sync across devices — separate from offline downloads',
  },
  {
    icon: 'offline' as const,
    label: 'Offline recipe downloads',
    sub: 'Cook without internet — up to 30 recipes on Plus',
  },
  {
    icon: 'partners' as const,
    label: 'Unlimited partner checkout',
    sub: 'Blinkit, Zepto, Instamart, Zomato & Swiggy',
  },
  {
    icon: 'zap' as const,
    label: 'No ads',
    sub: 'Clean home, plan & recipe experience',
  },
] as const;

export const PAID_PLAN_FEATURES = [
  'Full 3-day meal plan — 5 meals/day for Today, Tomorrow & the day after',
  'Unlimited plan & home shuffle — fresh picks whenever you want',
  'Unlimited saved recipes — keep every favourite dish',
  'Download up to 30 recipes for offline cooking (steps & ingredients)',
  'Unlimited Blinkit, Zepto, Instamart, Zomato & Swiggy checkout',
  '4 home picks with unlimited shuffle',
  'Allergy filter, all meal reminders & full seasonal picks',
  'No ads anywhere in the app',
] as const;

export const TRIAL_WELCOME_FEATURES = [
  'Full 3-day meal plan with limited daily shuffles',
  'Unlimited partner checkout — Blinkit, Zepto, Instamart, Zomato, Swiggy',
  'Up to 25 saved recipes during your trial',
  'Download up to 5 recipes for offline cooking',
  'Ads still show — subscribe to keep everything ad-free after trial',
] as const;

export const TRIAL_WELCOME_HERO_SUB_STARTED =
  'Your trial includes the full 3-day plan and unlimited partner checkout. Upgrade to Plus to remove ads, unlock unlimited saves & shuffles, and keep access after trial.';

export const TRIAL_WELCOME_HERO_SUB_NEW =
  'Try the 3-day meal planner and unlimited grocery & delivery checkout free. No payment until you subscribe below.';

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

export const PARTNER_TRIAL_NOTE = 'Unlocked during your free trial — ads still show until you subscribe';

export const PARTNER_PAID_NOTE = 'Included with Rasoi Plus';

export const FREE_PARTNER_SHOPS_PER_MONTH = 2;

export const FREE_PARTNER_FREEMIUM_NOTE =
  'Free plan includes 2 partner shops per month after your trial ends.';

export const FREE_PARTNER_COMPARE_LABEL = '2/mo';

export const FREE_PARTNER_COMPARE_FOOTNOTE =
  'After trial ends — 2 Blinkit, Zepto, Instamart, Zomato or Swiggy checkouts per calendar month.';

export const FREE_PARTNER_UPSELL =
  'Upgrade to Rasoi Plus for unlimited Blinkit, Zepto, Instamart, Zomato & Swiggy checkout.';

export function getPlanPriceLabel(interval: BillingInterval): string {
  return interval === 'yearly' ? PAID_PLAN_YEARLY_PRICE : PAID_PLAN_MONTHLY_PRICE;
}
