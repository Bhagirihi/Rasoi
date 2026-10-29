import { LinearGradient } from 'expo-linear-gradient';
import { LucideIcon } from 'lucide-react-native';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export { FreeBadge, PlanBadge } from '@/components/PlanBadge';

export function PrimaryButton({
  label,
  onPress,
  disabled,
  icon: Icon,
  style,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: LucideIcon;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.primaryWrap, disabled && styles.primaryDisabled, style]}
    >
      <LinearGradient
        colors={[colors.primary, colors.saffron]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.primaryBtn}
      >
        {Icon && <Icon size={20} color={colors.white} />}
        <Text style={styles.primaryBtnText}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}) {
  const { colors: themeColors } = useTheme();

  return (
    <View
      style={[
        styles.empty,
        { backgroundColor: themeColors.white, borderColor: themeColors.border },
      ]}
    >
      <View style={styles.emptyIconWrap}>
        <Icon size={32} color={colors.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: themeColors.charcoal }]}>{title}</Text>
      <Text style={[styles.emptySub, { color: themeColors.muted }]}>{subtitle}</Text>
    </View>
  );
}

export function InsightBanner({ title, subtitle }: { title: string; subtitle: string }) {
  const { colors: themeColors } = useTheme();

  return (
    <View style={styles.insight}>
      <Text style={styles.insightTitle}>{title}</Text>
      <Text style={[styles.insightSub, { color: themeColors.muted }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  primaryWrap: {
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.cta,
  },
  primaryDisabled: {
    opacity: 0.55,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
  },
  empty: {
    alignItems: 'center',
    padding: spacing.xxxl,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.xl,
    ...shadows.card,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,107,53,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginTop: spacing.lg,
    fontSize: 18,
    fontWeight: '800',
    color: colors.charcoal,
  },
  emptySub: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    textAlign: 'center',
  },
  insight: {
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,107,53,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.18)',
    padding: spacing.md + 2,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  insightSub: {
    marginTop: spacing.xs,
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
  },
});
