import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Check, ChefHat, ShoppingBag, X } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SmoothModal from '@/components/ui/SmoothModal';
import { colors, radius, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useShoppingSession } from '@/context/ShoppingSessionContext';
import { useTheme } from '@/context/ThemeContext';
import { maybeShowTrialValueMoment } from '@/utils/maybeTrialValueMoment';
import { remainingShoppingItems } from '@/utils/shoppingSessionStorage';

export default function ShoppingReturnSheet() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors: themeColors } = useTheme();
  const { effectiveTier, trialStartedAt, trialBonusDays } = useAppContext();
  const {
    returnPrompt,
    session,
    completedShopPrompt,
    confirmAddLastItem,
    dismissReturnPrompt,
    finishShopping,
    clearCompletedShopPrompt,
  } = useShoppingSession();

  useEffect(() => {
    if (!completedShopPrompt || returnPrompt) return;
    void maybeShowTrialValueMoment({
      effectiveTier,
      trialStartedAt,
      trialBonusDays,
      router,
      trigger: 'shop',
    });
  }, [
    completedShopPrompt,
    returnPrompt,
    effectiveTier,
    trialStartedAt,
    trialBonusDays,
    router,
  ]);

  if (completedShopPrompt && !returnPrompt) {
    const title = completedShopPrompt.recipeTitle ?? 'your recipe';
    return (
      <SmoothModal
        visible
        onClose={clearCompletedShopPrompt}
        variant="sheet"
      >
        <View
          style={[
            styles.sheet,
            {
              paddingBottom: Math.max(insets.bottom, spacing.lg),
              backgroundColor: themeColors.cream,
            },
          ]}
        >
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <ChefHat size={20} color={colors.primary} />
            </View>
            <View style={styles.headerCopy}>
              <Text style={[styles.title, { color: themeColors.charcoal }]}>
                Shopping done
              </Text>
              <Text style={[styles.subtitle, { color: themeColors.muted }]} numberOfLines={2}>
                Ready to cook {title}?
              </Text>
            </View>
            <Pressable onPress={clearCompletedShopPrompt} hitSlop={12} style={styles.closeBtn}>
              <X size={20} color={themeColors.muted} />
            </Pressable>
          </View>

          <Text style={[styles.hint, { color: themeColors.muted }]}>
            Pantry is updated. Jump into cook mode while everything is fresh.
          </Text>

          <Pressable
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              const id = completedShopPrompt.recipeId;
              clearCompletedShopPrompt();
              router.push(`/recipe/${id}?cook=1`);
            }}
            style={styles.primaryBtn}
          >
            <ChefHat size={18} color={colors.white} />
            <Text style={styles.primaryBtnText}>Start cooking</Text>
          </Pressable>

          <Pressable
            onPress={clearCompletedShopPrompt}
            style={[styles.secondaryBtn, { borderColor: themeColors.border }]}
          >
            <Text style={[styles.secondaryBtnText, { color: themeColors.charcoal }]}>
              Later
            </Text>
          </Pressable>
        </View>
      </SmoothModal>
    );
  }

  if (!returnPrompt) return null;

  const remaining = session ? remainingShoppingItems(session).length : 0;
  const shopped = session?.shoppedItems.length ?? 0;
  const total = session?.orderedItems.length ?? 0;
  const progressLabel =
    total > 0 ? `${shopped} of ${total} items shopped` : undefined;

  const handleConfirm = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    void confirmAddLastItem();
  };

  const handleNotYet = () => {
    void Haptics.selectionAsync();
    void dismissReturnPrompt();
  };

  const handleDone = () => {
    void Haptics.selectionAsync();
    void finishShopping();
  };

  return (
    <SmoothModal visible onClose={handleNotYet} variant="sheet">
      <View
        style={[
          styles.sheet,
          {
            paddingBottom: Math.max(insets.bottom, spacing.lg),
            backgroundColor: themeColors.cream,
          },
        ]}
      >
        <View style={styles.handle} />

        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <ShoppingBag size={20} color={colors.primary} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={[styles.title, { color: themeColors.charcoal }]}>Welcome back</Text>
            {returnPrompt.recipeTitle ? (
              <Text style={[styles.subtitle, { color: themeColors.muted }]} numberOfLines={1}>
                Shopping for {returnPrompt.recipeTitle}
              </Text>
            ) : null}
          </View>
          <Pressable onPress={handleNotYet} hitSlop={12} style={styles.closeBtn}>
            <X size={20} color={themeColors.muted} />
          </Pressable>
        </View>

        {progressLabel ? (
          <Text style={[styles.progress, { color: colors.primary }]}>{progressLabel}</Text>
        ) : null}

        <Text style={[styles.prompt, { color: themeColors.charcoal }]}>
          Add <Text style={styles.itemName}>{returnPrompt.item}</Text> to your pantry?
        </Text>
        <Text style={[styles.hint, { color: themeColors.muted }]}>
          We will mark it as in your kitchen and move you to the next item.
        </Text>

        <Pressable onPress={handleConfirm} style={styles.primaryBtn}>
          <Check size={18} color={colors.white} />
          <Text style={styles.primaryBtnText}>Yes, add to pantry</Text>
        </Pressable>

        <Pressable
          onPress={handleNotYet}
          style={[styles.secondaryBtn, { borderColor: themeColors.border }]}
        >
          <Text style={[styles.secondaryBtnText, { color: themeColors.charcoal }]}>Not yet</Text>
        </Pressable>

        {remaining > 0 ? (
          <Pressable onPress={handleDone} style={styles.doneLink}>
            <Text style={[styles.doneLinkText, { color: themeColors.muted }]}>
              Done shopping for now
            </Text>
          </Pressable>
        ) : null}
      </View>
    </SmoothModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.12)',
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,107,53,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  progress: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  prompt: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
  },
  itemName: {
    fontWeight: '800',
    color: colors.primary,
  },
  hint: {
    marginTop: spacing.sm,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: spacing.lg,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg - 2,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
  },
  secondaryBtn: {
    marginTop: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingVertical: spacing.lg - 2,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  doneLink: {
    marginTop: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  doneLinkText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
