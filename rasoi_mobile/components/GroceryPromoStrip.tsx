import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ShoppingBag, Sparkles, Zap } from 'lucide-react-native';
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
    <View style={styles.wrap}>
      <LinearGradient
        colors={['#F8CB46', '#7C3AED', '#FF5200']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.topAccent} />

        <Pressable
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onShopPress();
          }}
          style={({ pressed }) => [pressed && styles.mainPressed]}
        >
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Sparkles size={12} color={colors.white} />
              <Text style={styles.badgeText}>10–20 min delivery</Text>
            </View>
            {missingCount != null && missingCount > 0 && (
              <View style={styles.countBadge}>
                <Zap size={12} color={colors.white} />
                <Text style={styles.countBadgeText}>{missingCount} to buy</Text>
              </View>
            )}
          </View>

          <View style={styles.content}>
            <View style={styles.iconWrap}>
              <ShoppingBag size={22} color={colors.white} />
            </View>
            <View style={styles.copy}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.sub} numberOfLines={2}>
                {subtitle ?? defaultSub}
              </Text>
              <Text style={styles.cta}>{ctaLabel}</Text>
            </View>
            <View style={styles.arrowWrap}>
              <ChevronRight size={22} color={colors.white} />
            </View>
          </View>
        </Pressable>

        <View style={styles.partnerRow}>
          {groceryPartners.map((partner) => (
            <Pressable
              key={partner.id}
              onPress={() => handlePartnerPress(partner.id)}
              style={({ pressed }) => [styles.partnerPill, pressed && styles.partnerPillPressed]}
            >
              <View style={[styles.partnerDot, { backgroundColor: partner.accent }]} />
              <Text style={styles.partnerPillText}>{partner.label}</Text>
              <Text style={styles.partnerEta}>{partner.delivery}</Text>
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
  mainPressed: {
    opacity: 0.92,
  },
  gradient: {
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: radius.lg + 2,
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
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
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.white,
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
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
  },
  sub: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.92)',
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
  partnerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
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
  partnerPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.charcoal,
  },
  partnerEta: {
    marginTop: 1,
    fontSize: 9,
    fontWeight: '600',
    color: colors.muted,
  },
});
