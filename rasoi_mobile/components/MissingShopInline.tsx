import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GROCERY_PARTNER_UI } from '@/constants/monetization';
import { colors, radius, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { usePartners } from '@/context/PartnersContext';
import type { AffiliatePartner } from '@/utils/affiliate';
import { PAYWALL_HREF } from '@/utils/routes';

const GROCERY_IDS: AffiliatePartner[] = ['blinkit', 'zepto', 'instamart'];
const MISSING_BTN_COLOR = '#EF5350';

type MissingShopVariant = 'footer' | 'inline' | 'hero';

type MissingShopInlineProps = {
  missing: string[];
  variant?: MissingShopVariant;
  cookSlot?: ReactNode;
  onShopPress: () => void;
  onPartnerPress: (partner: AffiliatePartner) => void;
};

export const missingShopActionStyles = StyleSheet.create({
  cookPill: {
    flexShrink: 0,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  cookPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.white,
  },
});

export default function MissingShopInline({
  missing,
  variant = 'inline',
  cookSlot,
  onShopPress,
  onPartnerPress,
}: MissingShopInlineProps) {
  const router = useRouter();
  const { showPartners } = useAppContext();
  const { groceryPartners } = usePartners();
  const { colors: themeColors } = useTheme();

  if (missing.length === 0) {
    return null;
  }

  const isHero = variant === 'hero';
  const isFooter = variant === 'footer';
  const isCardLayout = isHero || isFooter;
  const showActionRow = Boolean(cookSlot);
  const ingredientPreview =
    missing.slice(0, 2).join(', ') + (missing.length > 2 ? ` +${missing.length - 2}` : '');
  const missingCta = missing.length === 1 ? 'Item missing' : 'Items missing';

  const partnerLabel = (id: AffiliatePartner) =>
    groceryPartners.find((p) => p.id === id)?.label ??
    id.charAt(0).toUpperCase() + id.slice(1);

  const handlePartnerPress = (id: AffiliatePartner) => {
    void Haptics.selectionAsync();
    if (showPartners) {
      onPartnerPress(id);
    } else {
      router.push(PAYWALL_HREF);
    }
  };

  const handleMissingPress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (showPartners) {
      onShopPress();
    } else {
      router.push(PAYWALL_HREF);
    }
  };

  const missingPill = (
    <Pressable
      onPress={(event) => {
        event.stopPropagation?.();
        handleMissingPress();
      }}
      style={styles.missingBtn}
    >
      <Text style={styles.missingBtnText} numberOfLines={1}>
        {missingCta} →
      </Text>
    </Pressable>
  );

  return (
    <View
      style={[
        isHero ? styles.wrapHero : styles.wrap,
        isFooter && [
          styles.wrapFooter,
          { backgroundColor: themeColors.white, borderTopColor: themeColors.border },
        ],
      ]}
    >
      {showActionRow ? (
        <View style={styles.actionRow}>
          {missingPill}
          {cookSlot}
        </View>
      ) : isCardLayout ? (
        missingPill
      ) : (
        <View style={styles.actionRow}>{missingPill}</View>
      )}

      {isCardLayout && (
        <Text
          style={[
            styles.missingIngredients,
            isHero ? styles.missingIngredientsHero : { color: themeColors.muted },
          ]}
          numberOfLines={2}
        >
          {ingredientPreview}
        </Text>
      )}

      <View style={styles.partnerRow}>
        {GROCERY_IDS.map((id) => {
          const ui = GROCERY_PARTNER_UI[id];
          const label = partnerLabel(id);
          const delivery = groceryPartners.find((p) => p.id === id)?.delivery ?? ui.delivery;
          return (
            <Pressable
              key={id}
              onPress={(event) => {
                event.stopPropagation?.();
                handlePartnerPress(id);
              }}
              style={[
                styles.partnerChip,
                isHero && styles.partnerChipHero,
                !isHero && { backgroundColor: themeColors.white, borderColor: themeColors.border },
                { borderColor: `${ui.accent}55` },
              ]}
            >
              <View style={[styles.partnerAccent, { backgroundColor: ui.accent }]} />
              <Text
                style={[
                  styles.partnerLabel,
                  isHero && styles.partnerLabelHero,
                  !isHero && { color: themeColors.charcoal },
                  id === 'blinkit' && !isHero && styles.partnerLabelDark,
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
              <Text
                style={[
                  styles.partnerEta,
                  isHero && styles.partnerEtaHero,
                  !isHero && { color: themeColors.muted },
                ]}
                numberOfLines={1}
              >
                {delivery.replace('~', '')}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  wrapFooter: {
    marginTop: 0,
    borderTopWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  wrapHero: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    gap: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  missingBtn: {
    flexShrink: 0,
    borderRadius: radius.pill,
    backgroundColor: MISSING_BTN_COLOR,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  missingBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.white,
  },
  missingIngredients: {
    fontSize: 11,
    fontWeight: '600',
  },
  missingIngredientsHero: {
    color: 'rgba(255,255,255,0.55)',
  },
  partnerRow: {
    flexDirection: 'row',
    gap: 6,
  },
  partnerChip: {
    flex: 1,
    alignItems: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
  partnerChipHero: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  partnerAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  partnerLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '800',
    color: colors.charcoal,
  },
  partnerLabelHero: {
    color: colors.white,
  },
  partnerLabelDark: {
    color: colors.charcoal,
  },
  partnerEta: {
    marginTop: 1,
    fontSize: 9,
    fontWeight: '600',
    color: colors.muted,
  },
  partnerEtaHero: {
    color: 'rgba(255,255,255,0.45)',
  },
});
