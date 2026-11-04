import { Redirect, Tabs, usePathname } from 'expo-router';
import { useMemo } from 'react';
import { Bookmark, BookOpen, CalendarDays, ChefHat, Refrigerator, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PantryNudgeBridge from '@/components/pantry/PantryNudgeBridge';
import TabIdleWarmup from '@/components/TabIdleWarmup';
import { getTabBarLayout } from '@/constants/tabBar';
import { testIds } from '@/constants/testIds';
import { useTheme } from '@/context/ThemeContext';
import { useAppContext } from '@/context/AppContext';

export default function TabLayout() {
  const { colors, screenBackground } = useTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const tabBarLayout = useMemo(() => getTabBarLayout(insets.bottom), [insets.bottom]);
  const {
    isHydrated,
    hasCompletedOnboarding,
    isLoggedIn,
    pendingTrialWelcome,
    pendingPantrySetup,
  } = useAppContext();

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      lazy: true,
      freezeOnBlur: false,
      detachInactiveScreens: true,
      sceneStyle: { backgroundColor: screenBackground },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.muted,
      tabBarStyle: {
        backgroundColor: colors.white,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        height: tabBarLayout.height,
        paddingBottom: tabBarLayout.paddingBottom,
        paddingTop: tabBarLayout.paddingTop,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600' as const,
      },
    }),
    [colors.primary, colors.muted, colors.white, colors.border, tabBarLayout, screenBackground],
  );

  if (!isHydrated) {
    return <Redirect href="/" />;
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  // Soft paywall before pantry setup when trial welcome is pending.
  if (pendingTrialWelcome) {
    return <Redirect href="/(auth)/trial-welcome" />;
  }

  if (pendingPantrySetup && !pathname.includes('/pantry')) {
    return <Redirect href="/(tabs)/pantry" />;
  }

  return (
    <>
      <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          lazy: false,
          tabBarButtonTestID: testIds.tabHome,
          tabBarIcon: ({ color, size }) => <ChefHat color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          lazy: false,
          tabBarButtonTestID: testIds.tabRecipes,
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: 'Plan',
          lazy: false,
          tabBarButtonTestID: testIds.tabPlan,
          tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="pantry"
        options={{
          title: 'Pantry',
          tabBarButtonTestID: testIds.tabPantry,
          tabBarIcon: ({ color, size }) => <Refrigerator color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarButtonTestID: testIds.tabSaved,
          tabBarIcon: ({ color, size }) => <Bookmark color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
          title: 'Settings',
          tabBarButtonTestID: testIds.tabSettings,
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size - 2} />,
        }}
      />
    </Tabs>
      <TabIdleWarmup />
      <PantryNudgeBridge />
    </>
  );
}

