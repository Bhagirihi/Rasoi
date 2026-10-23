import { describe, expect, it } from 'vitest';

import { isActiveTrial, TRIAL_DURATION_DAYS } from '@/lib/promo-codes';

const DAY = 86_400_000;

describe('isActiveTrial', () => {
  it('returns true for a trial inside the base window', () => {
    const now = Date.now();
    expect(
      isActiveTrial(
        {
          planTier: 'trial',
          trialStartedAt: new Date(now - DAY),
          trialBonusDays: 0,
        },
        now,
      ),
    ).toBe(true);
  });

  it('returns false once the base window has passed', () => {
    const now = Date.now();
    expect(
      isActiveTrial(
        {
          planTier: 'trial',
          trialStartedAt: new Date(now - (TRIAL_DURATION_DAYS + 1) * DAY),
          trialBonusDays: 0,
        },
        now,
      ),
    ).toBe(false);
  });

  it('extends the window by bonus days', () => {
    const now = Date.now();
    // Base window expired, but +10 bonus days keep it alive.
    expect(
      isActiveTrial(
        {
          planTier: 'trial',
          trialStartedAt: new Date(now - (TRIAL_DURATION_DAYS + 5) * DAY),
          trialBonusDays: 10,
        },
        now,
      ),
    ).toBe(true);
  });

  it('returns false for non-trial tiers and missing start', () => {
    const now = Date.now();
    expect(
      isActiveTrial({ planTier: 'paid', trialStartedAt: new Date(now), trialBonusDays: 0 }, now),
    ).toBe(false);
    expect(
      isActiveTrial({ planTier: 'free', trialStartedAt: new Date(now), trialBonusDays: 0 }, now),
    ).toBe(false);
    expect(
      isActiveTrial(
        { planTier: 'trial', trialStartedAt: null as unknown as Date, trialBonusDays: 0 },
        now,
      ),
    ).toBe(false);
  });
});
