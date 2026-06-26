import { formatAdminDateTime } from '@/app/admin/_components/admin-datetime';

export type AdminUserSyncStatus = 'synced' | 'auth_only';

export type AdminUserRow = {
  id: string;
  supabaseUserId: string | null;
  syncStatus: AdminUserSyncStatus;
  name: string;
  email: string | null;
  phone: string | null;
  dietLabel: string;
  regionalCuisine: string;
  favoriteCuisines: string[];
  isGuest: boolean;
  isActive: boolean;
  planTier: string;
  planLabel: string;
  trialStartedAt: string | null;
  trialBonusDays: number;
  trialTotalDays: number;
  trialActive: boolean;
  hasCompletedOnboarding: boolean;
  notificationsEnabled: boolean;
  pushTokenCount: number;
  timezone: string;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  locationUpdatedAt: string | null;
  termsAcceptedAt: string | null;
  createdAt: string;
  accountLabel: string;
  ineligibleReasons: string[];
  canManage: boolean;
  lastSignInAt?: string | null;
};

export function formatPlanTierLabel(planTier: string): string {
  switch (planTier) {
    case 'trial':
      return '3-day trial';
    case 'paid':
      return 'Rasoi Plus';
    case 'free':
      return 'Free';
    default:
      return planTier;
  }
}

export function formatAdminJoinedAt(iso: string): string {
  return formatAdminDateTime(iso);
}

export function isAuthOnlyRowId(id: string): boolean {
  return id.startsWith('auth:');
}
