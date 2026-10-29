import type { PlanFeatureLimits } from '@/constants/planFeatureLimits';
import type { PlanTier } from '@/constants/plans';

export function offlineRecipeLimitCopy(
  limit: number,
  currentCount: number,
): { title: string; message: string; ctaLabel: string } {
  if (limit === 0) {
    return {
      title: 'Offline downloads',
      message:
        'Download recipes to cook without internet — included with trial (5 recipes) and Rasoi Plus (30 recipes).',
      ctaLabel: 'Upgrade',
    };
  }

  return {
    title: 'Offline download limit',
    message:
      limit === 5
        ? `You can download up to ${limit} recipes during trial (${currentCount}/${limit} used). Remove one from recipe detail, or upgrade to Rasoi Plus for 30 offline recipes.`
        : `You can download up to ${limit} recipes for offline cooking (${currentCount}/${limit} used). Remove a download from recipe detail to free a slot.`,
    ctaLabel: limit === 5 ? 'Upgrade' : 'View plans',
  };
}

export function savedRecipeLimitCopy(limit: number | null): { title: string; message: string } {
  return {
    title: 'Saved recipe limit',
    message:
      limit === null
        ? 'Upgrade to Rasoi Plus for unlimited saved recipes.'
        : `Your plan allows ${limit} saved recipe${limit === 1 ? '' : 's'}. Upgrade to Rasoi Plus for unlimited saves.`,
  };
}

export function lockedPlanDayCopy(): { title: string; message: string } {
  return {
    title: '3-day plan',
    message:
      "Free plan includes today's meals only. Upgrade to Rasoi Plus to plan tomorrow and the day after.",
  };
}

export function allergyFilterCopy(): { title: string; message: string } {
  return {
    title: 'Allergy filter',
    message:
      'Hide recipes with nuts, gluten, dairy, and other allergens you avoid — included with Rasoi Plus.',
  };
}

export function homeShuffleLockedCopy(): { title: string; message: string } {
  return {
    title: 'Home shuffle unavailable',
    message:
      'Upgrade to Rasoi Plus for unlimited home shuffles and up to 4 picks. Free plan includes 1 shuffle per day.',
  };
}

export function planShuffleLockedCopy(): { title: string; message: string } {
  return {
    title: 'Plan shuffle unavailable',
    message:
      'Free plan does not include plan shuffle. Start a trial for 3 shuffles per day, or subscribe for unlimited.',
  };
}

export function shuffleDailyLimitCopy(
  kind: 'home' | 'plan',
  effectiveTier: PlanTier,
  dailyLimit: number,
): { title: string; message: string } {
  const noun = kind === 'home' ? 'home shuffle' : 'plan shuffle';
  const tierHint =
    effectiveTier === 'trial'
      ? `Your trial includes ${dailyLimit} ${noun}${dailyLimit === 1 ? '' : 's'} per day.`
      : `Your plan includes ${dailyLimit} ${noun}${dailyLimit === 1 ? '' : 's'} per day.`;

  return {
    title: 'Daily limit reached',
    message: `${tierHint} Come back tomorrow, or upgrade to Rasoi Plus for unlimited shuffles.`,
  };
}

export function partnerCheckoutLimitCopy(): { title: string; message: string } {
  return {
    title: 'Partner checkout limit reached',
    message:
      'You have used your 2 free partner shops this month. Upgrade to Rasoi Plus for unlimited Blinkit, Zepto, Instamart, Zomato, and Swiggy checkout.',
  };
}

export function planLimitFootnote(limits: PlanFeatureLimits, effectiveTier: PlanTier): string | null {
  if (effectiveTier === 'paid') return null;
  if (effectiveTier === 'trial') {
    return 'Trial: 4 home picks · 3 shuffles/day · 25 saves · 5 offline · 2 reminder slots';
  }
  return 'Free: 2 home picks · 1 shuffle/day · today-only plan · 10 saves · dinner reminder';
}
