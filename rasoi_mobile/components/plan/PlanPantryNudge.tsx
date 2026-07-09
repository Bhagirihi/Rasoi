import * as Haptics from 'expo-haptics';
import { CheckCircle2, ChevronRight, Refrigerator } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { appFonts } from '@/constants/fonts';
import { colors, radius, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { resolveCanonicalLabel } from '@/utils/pantryCanonical';

type PlanPantryNudgeProps = {
  missingCount: number;
  missingPreview: string[];
  onPress: () => void;
};

function formatPreview(items: string[]): string {
  const labels = items.map((name) => resolveCanonicalLabel(name) ?? name.trim());
  if (labels.length <= 3) return labels.join(', ');
  return `${labels.slice(0, 3).join(', ')} +${labels.length - 3}`;
}

export default function PlanPantryNudge({
  missingCount,
  missingPreview,
  onPress,
}: PlanPantryNudgeProps) {
  const { colors: themeColors } = useTheme();

  if (missingCount === 0) {
    return (
      <View
        style={[
          styles.card,
          styles.readyCard,
          { borderColor: 'rgba(0,168,107,0.25)' },
        ]}
      >
        <CheckCircle2 size={18} color={colors.green} />
        <Text style={[styles.readyText, { color: themeColors.charcoal }]}>
          Pantry looks good — you are set to cook!
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => {
        void Haptics.selectionAsync();
        onPress();
      }}
      style={({ pressed }) => [
        styles.card,
        styles.missingCard,
        { opacity: pressed ? 0.92 : 1 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${missingCount} ingredients missing. Open pantry.`}
    >
      <View style={styles.iconWrap}>
        <Refrigerator size={18} color={colors.primary} strokeWidth={2.2} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>
          {missingCount} ingredient{missingCount === 1 ? '' : 's'} missing
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.muted }]} numberOfLines={2}>
          {formatPreview(missingPreview)} · Tap to update pantry
        </Text>
      </View>
      <ChevronRight size={18} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  readyCard: {
    backgroundColor: 'rgba(0,168,107,0.08)',
    gap: spacing.sm,
  },
  readyText: {
    flex: 1,
    fontFamily: appFonts.bodyBold,
    fontSize: 13,
    lineHeight: 18,
  },
  missingCard: {
    backgroundColor: 'rgba(255,107,53,0.08)',
    borderColor: 'rgba(255,107,53,0.22)',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,107,53,0.12)',
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    fontFamily: appFonts.bodyBold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.primary,
  },
  subtitle: {
    fontFamily: appFonts.body,
    fontSize: 12,
    lineHeight: 16,
  },
});
