import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { radius } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import { useTheme } from '@/context/ThemeContext';

export default function AppHeaderSettingsButton() {
  const router = useRouter();
  const { colors: themeColors } = useTheme();

  return (
    <Pressable
      onPress={() => {
        void Haptics.selectionAsync();
        // settings tab uses href:null — push it (navigate silently does nothing
        // for a hidden tab); the screen has a back button, so it is a pushed screen
        router.push('/(tabs)/settings');
      }}
      hitSlop={10}
      testID={testIds.tabSettings}
      accessibilityRole="button"
      accessibilityLabel="Open settings"
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: themeColors.white,
          borderColor: themeColors.border,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
    >
      <Settings size={18} color={themeColors.charcoal} strokeWidth={2.2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
