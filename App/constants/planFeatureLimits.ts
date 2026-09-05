import type { PlanTier } from '@/constants/plans';

export type SeasonalRailMode = 'none' | 'basic' | 'full';

export type PlanFeatureLimits = {
  homePickCount: number;
  /** null = unlimited, 0 = locked */
  homeShuffleDailyLimit: number | null;
  maxPlanDayOffset: number;
  planShuffleDailyLimit: number | null;
  savedRecipeLimit: number | null;
  /** 0 = locked; otherwise max recipes stored on device for offline cooking */
  offlineRecipeLimit: number;
  notificationSlotIds: readonly string[] | 'all';
  allergyFilter: boolean;
  seasonalRailMode: SeasonalRailMode;
  recentCooksLimit: number;
};

export const PLAN_FEATURE_LIMITS: Record<PlanTier, PlanFeatureLimits> = {
  free: {
    homePickCount: 2,
    homeShuffleDailyLimit: 1,
    maxPlanDayOffset: 0,
    planShuffleDailyLimit: 0,
    savedRecipeLimit: 10,
    offlineRecipeLimit: 0,
    notificationSlotIds: ['rasoi-daily-dinner'],
    allergyFilter: false,
    seasonalRailMode: 'none',
    recentCooksLimit: 0,
  },
  trial: {
    homePickCount: 2,
    homeShuffleDailyLimit: 3,
    maxPlanDayOffset: 2,
    planShuffleDailyLimit: 3,
    savedRecipeLimit: 25,
    offlineRecipeLimit: 5,
    notificationSlotIds: ['rasoi-daily-breakfast', 'rasoi-daily-dinner'],
    allergyFilter: false,
    seasonalRailMode: 'none',
    recentCooksLimit: 4,
  },
  paid: {
    homePickCount: 2,
    homeShuffleDailyLimit: null,
    maxPlanDayOffset: 2,
    planShuffleDailyLimit: null,
    savedRecipeLimit: null,
    offlineRecipeLimit: 30,
    notificationSlotIds: 'all',
    allergyFilter: true,
    seasonalRailMode: 'none',
    recentCooksLimit: 8,
  },
};

/** Extra Home recipes beyond the 2 hero picks. Capped at 0 to keep Home fetch at 2. */
export const SEASONAL_RAIL_PICK_COUNTS: Record<SeasonalRailMode, number> = {
  none: 0,
  basic: 0,
  full: 0,
};
