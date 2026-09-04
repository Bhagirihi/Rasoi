import * as Haptics from 'expo-haptics';
import { Check, ChevronRight, ShoppingBag, X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AFFILIATE_CHECKOUT_DISCLOSURE } from '@/constants/monetization';
import { pickGroceryCheckoutItem, resolveGroceryPartnerId } from '@/constants/partners';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import TrialPartnerBanner from '@/components/TrialPartnerBanner';
import SmoothModal from '@/components/ui/SmoothModal';
import { useAppContext } from '@/context/AppContext';
import { usePartners } from '@/context/PartnersContext';
import { useShoppingSession } from '@/context/ShoppingSessionContext';
import { useTheme } from '@/context/ThemeContext';
import type { Recipe } from '@/data/mockRecipes';
import type { AffiliatePartner } from '@/utils/affiliate';
import { sortShoppingMissingItems } from '@/utils/shoppingOrder';
import { ingredientKey } from '@/utils/recipeIngredients';

type CheckoutVariant = 'recipe' | 'pantry';

interface AffiliateCheckoutModalProps {
  visible: boolean;
  onClose: () => void;
  recipeTitle?: string;
  recipeId?: string;
  recipe?: Recipe | null;
  missingIngredients: string[];
  initialPartner?: AffiliatePartner;
  initialFocusedItem?: string | null;
  variant?: CheckoutVariant;
}

const VISIBLE_CHIP_LIMIT = 8;

export default function AffiliateCheckoutModal({
  visible,
  onClose,
  recipeTitle,
  recipeId,
  recipe,
  missingIngredients,
  initialPartner,
  initialFocusedItem,
  variant = 'recipe',
}: AffiliateCheckoutModalProps) {
  const [loading, setLoading] = useState<AffiliatePartner | null>(null);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const { partnersInTrialMode } = useAppContext();
  const { groceryPartners, openGroceryCheckout } = usePartners();
  const { startSession, getSessionProgress, session } = useShoppingSession();
  const highlightedPartner = useMemo(
    () => resolveGroceryPartnerId(initialPartner, groceryPartners),
    [initialPartner, groceryPartners],
  );
  const { colors: themeColors } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const maxBodyScrollHeight = Math.min(windowHeight * 0.55, 420);

  const isPantry = variant === 'pantry';

  const orderedMissing = useMemo(
    () => sortShoppingMissingItems(missingIngredients, recipe),
    [missingIngredients, recipe],
  );

  const sessionProgress = getSessionProgress(recipeId);
  const shoppedKeys = useMemo(
    () => new Set((session?.shoppedItems ?? []).map((item) => ingredientKey(item))),
    [session?.shoppedItems],
  );

  const visibleItems = orderedMissing.slice(0, VISIBLE_CHIP_LIMIT);
  const hiddenCount = Math.max(0, orderedMissing.length - VISIBLE_CHIP_LIMIT);

  const headerCopy = useMemo(() => {
    if (sessionProgress && sessionProgress.total > 0) {
      return {
        title: isPantry ? 'Restock your pantry' : 'Get ingredients delivered',
        subtitle: `${sessionProgress.shopped} of ${sessionProgress.total} items shopped`,
      };
    }
    if (isPantry) {
      return {
        title: 'Restock your pantry',
        subtitle:
          missingIngredients.length > 0
            ? `${missingIngredients.length} staple${missingIngredients.length === 1 ? '' : 's'} to order`
            : 'Order missing staples in minutes',
      };
    }
    return {
      title: 'Get ingredients delivered',
      subtitle: recipeTitle
        ? `For ${recipeTitle}`
        : `${missingIngredients.length} item${missingIngredients.length === 1 ? '' : 's'} to add`,
    };
  }, [isPantry, missingIngredients.length, recipeTitle, sessionProgress]);

  useEffect(() => {
    if (!visible || orderedMissing.length === 0) return;
    void startSession({
      kind: isPantry ? 'pantry' : 'recipe',
      recipeId,
      recipeTitle,
      orderedItems: orderedMissing,
    });
  }, [visible, isPantry, recipeId, recipeTitle, orderedMissing, startSession]);

  useEffect(() => {
    if (!visible) {
      setLoading(null);
      setFocusedItem(null);
      return;
    }
    if (initialFocusedItem) {
      setFocusedItem(initialFocusedItem);
    }
  }, [visible, initialFocusedItem]);

  const defaultItem =
    orderedMissing.find((item) => !shoppedKeys.has(ingredientKey(item))) ??
    pickGroceryCheckoutItem(orderedMissing);
  const checkoutItem = focusedItem ?? defaultItem;

  const handleCheckout = async (partner: AffiliatePartner) => {
    if (!checkoutItem) return;
    setLoading(partner);
    try {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await openGroceryCheckout(partner, [checkoutItem], {
        context: isPantry ? 'pantry_restock' : 'recipe_checkout',
        recipeId,
        recipeTitle,
        shoppingItem: checkoutItem,
        sessionItems: orderedMissing,
        sessionKind: isPantry ? 'pantry' : 'recipe',
      });
      onClose();
    } finally {
      setLoading(null);
    }
  };

  return (
    <SmoothModal visible={visible} onClose={onClose} variant="sheet">
      <View
        style={[
          styles.sheet,
          { paddingBottom: Math.max(insets.bottom, spacing.md), backgroundColor: themeColors.cream },
        ]}
      >
        <View style={styles.handle} />

        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <View style={styles.headerIcon}>
              <ShoppingBag size={18} color={colors.primary} />
            </View>
            <View style={styles.headerText}>
              <Text style={[styles.title, { color: themeColors.charcoal }]}>{headerCopy.title}</Text>
              <Text style={[styles.subtitle, { color: themeColors.muted }]} numberOfLines={2}>
                {headerCopy.subtitle}
              </Text>
            </View>
          </View>
          <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
            <X size={20} color={themeColors.muted} />
          </Pressable>
        </View>

        <ScrollView
          style={{ maxHeight: maxBodyScrollHeight }}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {partnersInTrialMode && <TrialPartnerBanner />}

          {orderedMissing.length > 0 ? (
            <View
              style={[
                styles.listCard,
                { backgroundColor: themeColors.white, borderColor: themeColors.border },
              ]}
            >
              <Text style={[styles.listLabel, { color: themeColors.muted }]}>
                {sessionProgress
                  ? `Shopping checklist · ${sessionProgress.shopped}/${sessionProgress.total}`
                  : 'Shopping list · hero first, staples last'}
              </Text>
              <View style={styles.chipGrid}>
                {visibleItems.map((item) => {
                  const selected = checkoutItem === item;
                  const done = shoppedKeys.has(ingredientKey(item));
                  return (
                    <Pressable
                      key={item}
                      onPress={() => {
                        if (done) return;
                        void Haptics.selectionAsync();
                        setFocusedItem(item);
                      }}
                      style={[
                        styles.chip,
                        done && styles.chipDone,
                        {
                          borderColor: done
                            ? colors.green
                            : selected
                              ? colors.primary
                              : 'rgba(255,107,53,0.35)',
                          backgroundColor: done
                            ? 'rgba(0,168,107,0.12)'
                            : selected
                              ? 'rgba(255,107,53,0.16)'
                              : 'rgba(255,107,53,0.07)',
                        },
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={
                        done ? `${item} already shopped` : `Search for ${item} on partner app`
                      }
                      accessibilityState={{ selected: selected && !done, disabled: done }}
                      disabled={done}
                    >
                      {done ? <Check size={12} color={colors.green} /> : null}
                      <Text
                        style={[
                          styles.chipText,
                          { color: done ? colors.green : themeColors.charcoal },
                        ]}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  );
                })}
                {hiddenCount > 0 ? (
                  <View style={[styles.chip, styles.chipMore, { borderColor: themeColors.border }]}>
                    <Text style={[styles.chipText, { color: themeColors.muted }]}>+{hiddenCount} more</Text>
                  </View>
                ) : null}
              </View>
              {orderedMissing.length > 1 ? (
                <Text style={[styles.hint, { color: themeColors.muted }]}>
                  Partners search one item at a time. We suggest the hero ingredient first — tap
                  next, open a partner, then confirm when you return.
                </Text>
              ) : null}
              {orderedMissing.length > 1 ? (
                <Pressable
                  onPress={() => {
                    void Haptics.selectionAsync();
                    void import('react-native').then(({ Share }) =>
                      Share.share({
                        message: `Rasoi shopping list:\n${orderedMissing.map((item) => `• ${item}`).join('\n')}`,
                      }),
                    );
                  }}
                  style={styles.shareListBtn}
                >
                  <Text style={styles.shareListText}>Share full shopping list</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}

          <Text style={[styles.partnerLabel, { color: themeColors.muted }]}>
            Search “{checkoutItem}” via
          </Text>

          <View style={styles.partnerList}>
            {groceryPartners.map((partner) => {
              const isPreferred = partner.id === highlightedPartner;
              const isLoading = loading === partner.id;
              return (
                <Pressable
                  key={partner.id}
                  onPress={() => void handleCheckout(partner.id)}
                  disabled={loading !== null || orderedMissing.length === 0}
                  style={({ pressed }) => [
                    styles.partnerRow,
                    {
                      backgroundColor: themeColors.white,
                      borderColor: isPreferred ? partner.accent : themeColors.border,
                    },
                    pressed && styles.partnerRowPressed,
                    isLoading && styles.partnerRowLoading,
                    orderedMissing.length === 0 && styles.partnerRowDisabled,
                  ]}
                >
                  <View style={[styles.partnerSwatch, { backgroundColor: partner.accent }]} />
                  <View style={styles.partnerCopy}>
                    <Text style={[styles.partnerName, { color: themeColors.charcoal }]}>
                      {isLoading ? 'Opening…' : partner.label}
                    </Text>
                    <Text style={[styles.partnerEta, { color: themeColors.muted }]}>10–20 min</Text>
                  </View>
                  <ChevronRight size={18} color={themeColors.muted} />
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.disclosure, { color: themeColors.muted }]}>
            {AFFILIATE_CHECKOUT_DISCLOSURE}
          </Text>
        </ScrollView>
      </View>
    </SmoothModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    width: '100%',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    overflow: 'hidden',
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.12)',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  headerCopy: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    minWidth: 0,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,107,53,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  listCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  listLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  chipDone: {
    opacity: 0.85,
  },
  chipMore: {
    backgroundColor: 'transparent',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  hint: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: spacing.sm,
  },
  shareListBtn: {
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
  },
  shareListText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  partnerLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginTop: spacing.xs,
  },
  partnerList: {
    gap: spacing.xs,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 52,
    ...shadows.card,
  },
  partnerRowPressed: {
    opacity: 0.92,
  },
  partnerRowLoading: {
    opacity: 0.7,
  },
  partnerRowDisabled: {
    opacity: 0.45,
  },
  partnerSwatch: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
    minHeight: 28,
  },
  partnerCopy: {
    flex: 1,
    gap: 1,
  },
  partnerName: {
    fontSize: 15,
    fontWeight: '800',
  },
  partnerEta: {
    fontSize: 11,
    fontWeight: '600',
  },
  disclosure: {
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
