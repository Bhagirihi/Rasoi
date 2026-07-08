import { Redirect, Tabs, usePathname } from 'expo-router';
import { useMemo } from 'react';
import { Platform } from 'react-native';
import { Bookmark, BookOpen, CalendarDays, ChefHat, Refrigerator, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { testIds } from '@/constants/testIds';
import { useTheme } from '@/context/ThemeContext';
import { useAppContext } from '@/context/AppContext';

const TAB_BAR_TOP_PADDING = 8;
const TAB_BAR_BODY_HEIGHT = Platform.OS === 'ios' ? 49 : 48;

function getTabBarLayout(bottomInset: number) {
  const paddingBottom = Math.max(bottomInset, Platform.OS === 'ios' ? 24 : 8);

  return {
    height: TAB_BAR_BODY_HEIGHT + TAB_BAR_TOP_PADDING + paddingBottom,
    paddingBottom,
    paddingTop: TAB_BAR_TOP_PADDING,
  };
}

export default function TabLayout() {
  const { colors } = useTheme();
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
    [colors.primary, colors.muted, colors.white, colors.border, tabBarLayout],
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

  if (pendingTrialWelcome && !pendingPantrySetup) {
    return <Redirect href="/(auth)/trial-welcome" />;
  }

  if (pendingPantrySetup && !pathname.includes('/pantry')) {
    return <Redirect href="/(tabs)/pantry" />;
  }

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarButtonTestID: testIds.tabHome,
          tabBarIcon: ({ color, size }) => <ChefHat color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          tabBarButtonTestID: testIds.tabRecipes,
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size - 2} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: 'Plan',
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
          title: 'Settings',
          tabBarButtonTestID: testIds.tabSettings,
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size - 2} />,
        }}
      />
    </Tabs>
  );
}
