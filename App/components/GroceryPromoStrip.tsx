import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ShoppingBag, Zap } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows, spacing } from '@/constants/theme';
import { usePartners } from '@/context/PartnersContext';
import type { AffiliatePartner } from '@/utils/affiliate';

interface GroceryPromoStripProps {
  onShopPress: () => void;
  onPartnerPress?: (partner: AffiliatePartner) => void;
  title?: string;
  subtitle?: string;
  missingCount?: number;
  recipeTitle?: string;
  /** Uses generic CTA copy instead of the combined partner name line. */
  hidePartnerBranding?: boolean;
  ctaText?: string;
  /** Shorter card for Pantry and inline surfaces. */
  compact?: boolean;
}

export default function GroceryPromoStrip({
  onShopPress,
  onPartnerPress,
  title = 'Need groceries?',
  subtitle,
  missingCount,
  recipeTitle,
  hidePartnerBranding = false,
  ctaText,
  compact = false,
}: GroceryPromoStripProps) {
  const { groceryPartners } = usePartners();

  const defaultSub =
    missingCount != null && missingCount > 0
      ? `${missingCount} item${missingCount !== 1 ? 's' : ''} missing — order in ~10–20 min`
      : recipeTitle
        ? `Stock up for ${recipeTitle} via quick commerce`
        : 'Fresh groceries delivered in ~10–20 min';

  const ctaLabel =
    ctaText ??
    (hidePartnerBranding ? 'Order groceries →' : 'Shop on Blinkit · Zepto · Instamart →');

  const handlePartnerPress = (partner: AffiliatePartner) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onPartnerPress) {
      onPartnerPress(partner);
    } else {
      onShopPress();
    }
  };

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <LinearGradient
        colors={['#F8CB46', '#7C3AED', '#FF5200']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, compact && styles.gradientCompact]}
      >
        <Pressable
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onShopPress();
          }}
          style={({ pressed }) => [pressed && styles.mainPressed]}
        >
          <View style={[styles.badgeRow, compact && styles.badgeRowCompact]}>
            <View style={[styles.badge, compact && styles.badgeCompact]}>
              <Text style={[styles.badgeText, compact && styles.badgeTextCompact]}>
                10–20 min
              </Text>
            </View>
            {missingCount != null && missingCount > 0 ? (
              <View style={[styles.countBadge, compact && styles.badgeCompact]}>
                <Zap size={10} color={colors.white} />
                <Text style={[styles.countBadgeText, compact && styles.badgeTextCompact]}>
                  {missingCount} to buy
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.content}>
            {!compact ? (
              <View style={styles.iconWrap}>
                <ShoppingBag size={22} color={colors.white} />
              </View>
            ) : null}
            <View style={styles.copy}>
              <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>
              <Text style={[styles.sub, compact && styles.subCompact]} numberOfLines={compact ? 1 : 2}>
                {subtitle ?? defaultSub}
              </Text>
              {!compact ? <Text style={styles.cta}>{ctaLabel}</Text> : null}
            </View>
            <View style={[styles.arrowWrap, compact && styles.arrowWrapCompact]}>
              <ChevronRight size={compact ? 18 : 22} color={colors.white} />
            </View>
          </View>
        </Pressable>

        <View style={[styles.partnerRow, compact && styles.partnerRowCompact]}>
          {groceryPartners.map((partner) => (
            <Pressable
              key={partner.id}
              onPress={() => handlePartnerPress(partner.id)}
              style={({ pressed }) => [
                styles.partnerPill,
                compact && styles.partnerPillCompact,
                pressed && styles.partnerPillPressed,
              ]}
            >
              <View style={[styles.partnerDot, compact && styles.partnerDotCompact, { backgroundColor: partner.accent }]} />
              <Text style={[styles.partnerPillText, compact && styles.partnerPillTextCompact]}>
                {partner.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radius.lg + 2,
    overflow: 'hidden',
    ...shadows.cardLifted,
  },
  wrapCompact: {
    marginTop: 0,
    marginBottom: 0,
    borderRadius: radius.md,
    ...shadows.card,
  },
  mainPressed: {
    opacity: 0.92,
  },
  gradient: {
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: radius.lg + 2,
  },
  gradientCompact: {
    padding: spacing.sm + 2,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  badgeRowCompact: {
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.22)',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  badgeCompact: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.white,
  },
  badgeTextCompact: {
    fontSize: 9,
    letterSpacing: 0.3,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
  },
  titleCompact: {
    fontSize: 15,
    lineHeight: 19,
  },
  sub: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.92)',
  },
  subCompact: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 15,
  },
  cta: {
    marginTop: spacing.sm,
    fontSize: 13,
    fontWeight: '800',
    color: colors.white,
    textDecorationLine: 'underline',
  },
  arrowWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowWrapCompact: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  partnerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  partnerRowCompact: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  partnerPill: {
    flex: 1,
    alignItems: 'center',
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: spacing.sm,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  partnerPillCompact: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  partnerPillPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  partnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  partnerDotCompact: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 0,
  },
  partnerPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.charcoal,
  },
  partnerPillTextCompact: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 0,
  },
  partnerEta: {
    marginTop: 1,
    fontSize: 9,
    fontWeight: '600',
    color: colors.muted,
  },
});
