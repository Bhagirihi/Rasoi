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
    // Soften post-trial cliff: breakfast + dinner reminders, basic seasonal rail.
    notificationSlotIds: ['rasoi-daily-breakfast', 'rasoi-daily-dinner'],
    allergyFilter: false,
    seasonalRailMode: 'basic',
    recentCooksLimit: 2,
  },
  trial: {
    homePickCount: 4,
    homeShuffleDailyLimit: 3,
    maxPlanDayOffset: 2,
    planShuffleDailyLimit: 3,
    savedRecipeLimit: 25,
    offlineRecipeLimit: 5,
    notificationSlotIds: ['rasoi-daily-breakfast', 'rasoi-daily-dinner'],
    allergyFilter: false,
    seasonalRailMode: 'basic',
    recentCooksLimit: 4,
  },
  paid: {
    homePickCount: 4,
    homeShuffleDailyLimit: null,
    maxPlanDayOffset: 2,
    planShuffleDailyLimit: null,
    savedRecipeLimit: null,
    offlineRecipeLimit: 30,
    notificationSlotIds: 'all',
    allergyFilter: true,
    seasonalRailMode: 'full',
    recentCooksLimit: 8,
  },
};

export const SEASONAL_RAIL_PICK_COUNTS: Record<SeasonalRailMode, number> = {
  none: 0,
  basic: 2,
  full: 3,
};
