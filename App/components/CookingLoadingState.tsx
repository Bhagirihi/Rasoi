import LottieView from 'lottie-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { cookingLottie } from '@/constants/animations';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

type CookingLoadingStateProps = {
  title?: string;
  subtitle?: string;
};

export default function CookingLoadingState({
  title = 'Loading recipes',
  subtitle = "Fetching tonight's dishes from Rasoi…",
}: CookingLoadingStateProps) {
  const { colors: themeColors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: themeColors.white, borderColor: themeColors.border },
      ]}
    >
      <LottieView
        source={cookingLottie}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={[styles.title, { color: themeColors.charcoal }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: themeColors.muted }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    ...shadows.card,
  },
  lottie: {
    width: 220,
    height: 180,
  },
  title: {
    marginTop: spacing.sm,
    fontSize: 18,
    fontWeight: '800',
    color: colors.charcoal,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
});
