import { ChefHat, Refrigerator, ShoppingBag, X } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SmoothModal from '@/components/ui/SmoothModal';
import { appFonts } from '@/constants/fonts';
import { colors, radius, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import type { PantryNudgeWindow } from '@/utils/pantryNudgeWindows';
import { PANTRY_NUDGE_WINDOWS } from '@/utils/pantryNudgeWindows';

type PantryNudgeModalProps = {
  visible: boolean;
  window: PantryNudgeWindow;
  recipeTitle?: string;
  onDismiss: () => void;
  onCheckPantry: () => void;
  onOrderMissing: () => void;
  onCookTonight?: () => void;
};

export default function PantryNudgeModal({
  visible,
  window,
  recipeTitle,
  onDismiss,
  onCheckPantry,
  onOrderMissing,
  onCookTonight,
}: PantryNudgeModalProps) {
  const insets = useSafeAreaInsets();
  const { colors: themeColors } = useTheme();
  const windowLabel =
    PANTRY_NUDGE_WINDOWS.find((entry) => entry.id === window)?.label ?? 'Today';

  const body = recipeTitle
    ? `${windowLabel} reminder — a few ingredients for ${recipeTitle} may still be missing. Update your pantry or order them before you cook.`
    : `${windowLabel} reminder — some ingredients for your meals may still be missing. Update your pantry or order staples in minutes.`;

  return (
    <SmoothModal visible={visible} onClose={onDismiss} variant="center" dismissOnBackdrop>
      <View
        style={[
          styles.card,
          {
            backgroundColor: themeColors.white,
            borderColor: themeColors.border,
            marginTop: insets.top,
            marginBottom: insets.bottom,
          },
        ]}
      >
        <Pressable
          onPress={onDismiss}
          style={styles.closeButton}
          accessibilityRole="button"
          accessibilityLabel="Dismiss pantry reminder"
        >
          <X size={20} color={themeColors.muted} />
        </Pressable>

        <View style={[styles.iconHero, { backgroundColor: 'rgba(255,107,53,0.1)' }]}>
          <Refrigerator size={28} color={colors.primary} strokeWidth={2.2} />
        </View>

        <Text style={[styles.title, { color: themeColors.charcoal }]}>
          {recipeTitle ? 'Ready for today’s pick?' : 'Check your pantry?'}
        </Text>
        <Text style={[styles.body, { color: themeColors.muted }]}>{body}</Text>

        {onCookTonight && recipeTitle ? (
          <Pressable
            onPress={onCookTonight}
            style={styles.primaryBtn}
            accessibilityRole="button"
            accessibilityLabel={`Cook ${recipeTitle}`}
          >
            <ChefHat size={18} color={colors.white} strokeWidth={2.2} />
            <Text style={styles.primaryBtnText}>Cook {recipeTitle}</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={onCheckPantry}
            style={styles.primaryBtn}
            accessibilityRole="button"
            accessibilityLabel="Open pantry"
          >
            <Refrigerator size={18} color={colors.white} strokeWidth={2.2} />
            <Text style={styles.primaryBtnText}>Check pantry</Text>
          </Pressable>
        )}

        <Pressable
          onPress={onOrderMissing}
          style={[styles.secondaryBtn, { borderColor: themeColors.border }]}
          accessibilityRole="button"
          accessibilityLabel="Order missing ingredients"
        >
          <ShoppingBag size={18} color={colors.primary} strokeWidth={2.2} />
          <Text style={styles.secondaryBtnText}>Order missing items</Text>
        </Pressable>

        {onCookTonight && recipeTitle ? (
          <Pressable
            onPress={onCheckPantry}
            style={styles.dismissBtn}
            accessibilityRole="button"
            accessibilityLabel="Open pantry"
          >
            <Text style={[styles.dismissText, { color: themeColors.muted }]}>
              Check pantry instead
            </Text>
          </Pressable>
        ) : (
          <Pressable onPress={onDismiss} style={styles.dismissBtn}>
            <Text style={[styles.dismissText, { color: themeColors.muted }]}>Not now</Text>
          </Pressable>
        )}
      </View>
    </SmoothModal>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 2,
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconHero: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  title: {
    fontFamily: appFonts.bodyBold,
    fontSize: 20,
    lineHeight: 26,
    textAlign: 'center',
  },
  body: {
    fontFamily: appFonts.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  primaryBtnText: {
    fontFamily: appFonts.bodyBold,
    fontSize: 15,
    color: colors.charcoal,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingVertical: spacing.md,
  },
  secondaryBtnText: {
    fontFamily: appFonts.bodyBold,
    fontSize: 15,
    color: colors.primary,
  },
  dismissBtn: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  dismissText: {
    fontFamily: appFonts.bodyMedium,
    fontSize: 14,
  },
});
