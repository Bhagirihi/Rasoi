import * as Haptics from 'expo-haptics';
import { ChevronRight, ShoppingBag, X } from 'lucide-react-native';
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
import { colors, radius, shadows, spacing } from '@/constants/theme';
import TrialPartnerBanner from '@/components/TrialPartnerBanner';
import SmoothModal from '@/components/ui/SmoothModal';
import { useAppContext } from '@/context/AppContext';
import { usePartners } from '@/context/PartnersContext';
import { useTheme } from '@/context/ThemeContext';
import type { AffiliatePartner } from '@/utils/affiliate';

type CheckoutVariant = 'recipe' | 'pantry';

interface AffiliateCheckoutModalProps {
  visible: boolean;
  onClose: () => void;
  recipeTitle?: string;
  recipeId?: string;
  missingIngredients: string[];
  initialPartner?: AffiliatePartner;
  variant?: CheckoutVariant;
}

const VISIBLE_CHIP_LIMIT = 8;

export default function AffiliateCheckoutModal({
  visible,
  onClose,
  recipeTitle,
  recipeId,
  missingIngredients,
  initialPartner = 'blinkit',
  variant = 'recipe',
}: AffiliateCheckoutModalProps) {
  const [loading, setLoading] = useState<AffiliatePartner | null>(null);
  const { partnersInTrialMode } = useAppContext();
  const { groceryPartners, openGroceryCheckout } = usePartners();
  const { colors: themeColors } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const maxBodyScrollHeight = Math.min(windowHeight * 0.55, 420);

  const isPantry = variant === 'pantry';
  const visibleItems = missingIngredients.slice(0, VISIBLE_CHIP_LIMIT);
  const hiddenCount = Math.max(0, missingIngredients.length - VISIBLE_CHIP_LIMIT);

  const headerCopy = useMemo(() => {
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
  }, [isPantry, missingIngredients.length, recipeTitle]);

  useEffect(() => {
    if (!visible) setLoading(null);
  }, [visible]);

  const handleCheckout = async (partner: AffiliatePartner) => {
    if (missingIngredients.length === 0) return;
    setLoading(partner);
    try {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await openGroceryCheckout(partner, missingIngredients, {
        context: isPantry ? 'pantry_restock' : 'recipe_checkout',
        recipeId,
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

          {missingIngredients.length > 0 ? (
            <View
              style={[
                styles.listCard,
                { backgroundColor: themeColors.white, borderColor: themeColors.border },
              ]}
            >
              <Text style={[styles.listLabel, { color: themeColors.muted }]}>Shopping list</Text>
              <View style={styles.chipGrid}>
                {visibleItems.map((item) => (
                  <View
                    key={item}
                    style={[
                      styles.chip,
                      { borderColor: 'rgba(255,107,53,0.35)', backgroundColor: 'rgba(255,107,53,0.07)' },
                    ]}
                  >
                    <Text style={[styles.chipText, { color: themeColors.charcoal }]}>{item}</Text>
                  </View>
                ))}
                {hiddenCount > 0 ? (
                  <View style={[styles.chip, styles.chipMore, { borderColor: themeColors.border }]}>
                    <Text style={[styles.chipText, { color: themeColors.muted }]}>+{hiddenCount} more</Text>
                  </View>
                ) : null}
              </View>
              {missingIngredients.length > 1 ? (
                <Text style={[styles.hint, { color: themeColors.muted }]}>
                  Partner search opens with top items — tap Share list below for the full shopping list.
                </Text>
              ) : null}
              {missingIngredients.length > 1 ? (
                <Pressable
                  onPress={() => {
                    void Haptics.selectionAsync();
                    void import('react-native').then(({ Share }) =>
                      Share.share({
                        message: `Rasoi shopping list:\n${missingIngredients.map((item) => `• ${item}`).join('\n')}`,
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

          <Text style={[styles.partnerLabel, { color: themeColors.muted }]}>Order via</Text>

          <View style={styles.partnerList}>
            {groceryPartners.map((partner) => {
              const isPreferred = partner.id === initialPartner;
              const isLoading = loading === partner.id;
              return (
                <Pressable
                  key={partner.id}
                  onPress={() => void handleCheckout(partner.id)}
                  disabled={loading !== null || missingIngredients.length === 0}
                  style={({ pressed }) => [
                    styles.partnerRow,
                    {
                      backgroundColor: themeColors.white,
                      borderColor: isPreferred ? partner.accent : themeColors.border,
                    },
                    pressed && styles.partnerRowPressed,
                    isLoading && styles.partnerRowLoading,
                    missingIngredients.length === 0 && styles.partnerRowDisabled,
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
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
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
