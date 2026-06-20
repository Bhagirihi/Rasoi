export type AdminUserRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  dietLabel: string;
  regionalCuisine: string;
  favoriteCuisines: string[];
  isGuest: boolean;
  isActive: boolean;
  planTier: string;
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
};

export function formatAdminJoinedAt(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
