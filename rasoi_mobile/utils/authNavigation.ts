import type { AuthNavigationResult } from '@/context/AppContext';
import {
  getMissingPermissionsState,
  isPermissionsOnboardingComplete,
  markPermissionsOnboardingComplete,
  permissionsOnboardingHref,
} from '@/utils/permissionsOnboarding';

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

  const permissionsPromptDone = await isPermissionsOnboardingComplete();
  if (!permissionsPromptDone) {
    const permState = await getMissingPermissionsState(options.userCity);
    if (permState.needsFlow) {
      return permissionsOnboardingHref(permState.initialStep);
    }
    await markPermissionsOnboardingComplete();
  }

  // Soft paywall (trial welcome) before pantry — higher intent while setup is still ahead.
  if (nav.showTrialWelcome) {
    return '/(auth)/trial-welcome';
  }

  if (options.pendingPantrySetup) {
    return '/(tabs)/pantry';
  }

  return '/(tabs)';
}
