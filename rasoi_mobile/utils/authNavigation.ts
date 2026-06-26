import type { AuthNavigationResult } from '@/context/AppContext';
import { shouldShowPermissionsOnboarding } from '@/utils/permissionsOnboarding';

export async function resolvePostAuthHref(
  nav: AuthNavigationResult,
  options: {
    userCity: string | null;
    pendingPantrySetup: boolean;
  },
): Promise<string> {
  if (!nav.hasCompletedOnboarding) {
    return '/(auth)/onboarding';
  }

  if (await shouldShowPermissionsOnboarding(options.userCity)) {
    return '/(auth)/onboarding?permissionsOnly=1';
  }

  if (options.pendingPantrySetup) {
    return '/(tabs)/pantry';
  }

  if (nav.showTrialWelcome) {
    return '/(auth)/trial-welcome';
  }

  return '/(tabs)';
}
