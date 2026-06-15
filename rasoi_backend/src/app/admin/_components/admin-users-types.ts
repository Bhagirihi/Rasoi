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
  ineligibleReasons: string[];
};
