import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/context/ThemeContext';

export default function AppHeaderBackButton() {
  const router = useRouter();
  const { colors: themeColors } = useTheme();

  return (
    <Pressable
      onPress={() => {
        void Haptics.selectionAsync();
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/(tabs)');
        }
      }}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: themeColors.white,
          borderColor: themeColors.border,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
    >
      <ChevronLeft size={20} color={themeColors.charcoal} strokeWidth={2.4} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
