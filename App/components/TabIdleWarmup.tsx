import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { InteractionManager } from 'react-native';

/** After Home settles, prefetch lower-traffic tabs so first tap feels instant. */
export default function TabIdleWarmup() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const task = InteractionManager.runAfterInteractions(() => {
      timer = setTimeout(() => {
        if (cancelled) return;
        void router.prefetch('/(tabs)/plan');
        void router.prefetch('/(tabs)/pantry');
        void router.prefetch('/(tabs)/saved');
      }, 1200);
    });

    return () => {
      cancelled = true;
      task.cancel();
      if (timer) clearTimeout(timer);
    };
  }, [router]);

  return null;
}
