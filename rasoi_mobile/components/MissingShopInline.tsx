import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Lock, ShoppingBag } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GROCERY_PARTNER_UI } from '@/constants/monetization';
import { colors, radius, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { usePartners } from '@/context/PartnersContext';
import type { AffiliatePartner } from '@/utils/affiliate';
import { PAYWALL_HREF } from '@/utils/routes';

const GROCERY_IDS: AffiliatePartner[] = ['blinkit', 'zepto', 'instamart'];

type MissingShopVariant = 'footer' | 'inline' | 'hero';

type MissingShopInlineProps = {
  missing: string[];
  variant?: MissingShopVariant;
  onShopPress: () => void;
  onPartnerPress: (partner: AffiliatePartner) => void;
};

export default function MissingShopInline({
  missing,
  variant = 'inline',
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
  const ingredientPreview = missing.slice(0, 2).join(', ') + (missing.length > 2 ? ` +${missing.length - 2}` : '');

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

  return (
    <View
      style={[
        styles.wrap,
        isFooter && [
          styles.wrapFooter,
          { backgroundColor: themeColors.white, borderTopColor: themeColors.border },
        ],
        isHero && styles.wrapHero,
      ]}
    >
      <Pressable onPress={handleMissingPress} style={styles.summaryRow}>
        <View style={[styles.countBadge, isHero && styles.countBadgeHero]}>
          <ShoppingBag size={12} color={isHero ? colors.primary : colors.white} />
          <Text style={[styles.countText, isHero && styles.countTextHero]}>
            {missing.length}
          </Text>
        </View>
        <View style={styles.summaryCopy}>
          <Text style={[styles.summaryTitle, isHero && styles.summaryTitleHero, !isHero && { color: themeColors.charcoal }]}>
            {missing.length === 1 ? 'Item missing' : 'Items missing'}
          </Text>
          <Text
            style={[styles.summarySub, isHero && styles.summarySubHero, !isHero && { color: themeColors.muted }]}
            numberOfLines={1}
          >
            {ingredientPreview}
          </Text>
        </View>
        {!showPartners && (
          <Lock size={13} color={isHero ? 'rgba(255,255,255,0.45)' : colors.muted} />
        )}
      </Pressable>

      <View style={styles.partnerRow}>
        {GROCERY_IDS.map((id) => {
          const ui = GROCERY_PARTNER_UI[id];
          const label = partnerLabel(id);
          const delivery = groceryPartners.find((p) => p.id === id)?.delivery ?? ui.delivery;
          return (
            <Pressable
              key={id}
              onPress={() => handlePartnerPress(id)}
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
              <Text style={[styles.partnerEta, isHero && styles.partnerEtaHero, !isHero && { color: themeColors.muted }]} numberOfLines={1}>
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
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    gap: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  countBadgeHero: {
    backgroundColor: 'rgba(255,107,53,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.45)',
  },
  countText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.white,
  },
  countTextHero: {
    color: colors.primary,
  },
  summaryCopy: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.charcoal,
  },
  summaryTitleHero: {
    color: colors.white,
  },
  summarySub: {
    marginTop: 1,
    fontSize: 11,
    color: colors.muted,
  },
  summarySubHero: {
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
