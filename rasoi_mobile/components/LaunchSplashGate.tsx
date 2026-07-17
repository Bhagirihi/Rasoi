import { useEffect, useRef } from 'react';

import { LAUNCH_SPLASH_MAX_MS, LAUNCH_SPLASH_MIN_MS } from '@/components/LaunchSplash';
import { useAppContext } from '@/context/AppContext';
import { useRecipes } from '@/context/RecipesContext';

type LaunchSplashGateProps = {
  fontsLoaded: boolean;
  launchDone: boolean;
  splashDismissing: boolean;
  onReady: () => void;
};

/** Dismiss splash once fonts, auth hydration, and first recipe fetch have settled. */
export default function LaunchSplashGate({
  fontsLoaded,
  launchDone,
  splashDismissing,
  onReady,
}: LaunchSplashGateProps) {
  const { isHydrated } = useAppContext();
  const { loading: recipesLoading, recipes, error: recipesError } = useRecipes();
  const startedAtRef = useRef(Date.now());
  const finishedRef = useRef(false);

  const catalogReady = !recipesLoading || recipes.length > 0 || recipesError != null;
  const appReady = fontsLoaded && isHydrated && catalogReady;

  useEffect(() => {
    if (launchDone || splashDismissing || finishedRef.current || !fontsLoaded) return;

    const finish = () => {
      if (finishedRef.current || launchDone || splashDismissing) return;
      finishedRef.current = true;
      onReady();
    };

    const tryFinish = () => {
      const elapsed = Date.now() - startedAtRef.current;
      if (appReady && elapsed >= LAUNCH_SPLASH_MIN_MS) {
        finish();
      }
    };

    tryFinish();

    const maxTimer = setTimeout(finish, LAUNCH_SPLASH_MAX_MS);
    const poll = setInterval(tryFinish, 80);

    return () => {
      clearTimeout(maxTimer);
      clearInterval(poll);
    };
  }, [appReady, fontsLoaded, launchDone, onReady, splashDismissing]);

  return null;
}
