import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Lock, ShoppingBag } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FREE_PARTNER_SHOPS_PER_MONTH, FREE_PARTNER_UPSELL } from '@/constants/plans';
import { colors, radius, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { PAYWALL_HREF } from '@/utils/routes';

interface PartnerUpsellCardProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export default function PartnerUpsellCard({
  title = 'Shop & delivery partners',
  subtitle = FREE_PARTNER_UPSELL,
  compact = false,
}: PartnerUpsellCardProps) {
  const router = useRouter();
  const { partnerAccess, effectiveTier } = useAppContext();

  const quotaSubtitle =
    effectiveTier === 'free' && partnerAccess.freemiumMode
      ? partnerAccess.remainingFreeShops > 0
        ? `${partnerAccess.remainingFreeShops} of ${FREE_PARTNER_SHOPS_PER_MONTH} free checkouts left this month`
        : 'Free checkouts used this month — upgrade for unlimited'
      : subtitle;

  return (
    <Pressable
      onPress={() => router.push(PAYWALL_HREF)}
      style={[styles.wrap, compact && styles.wrapCompact]}
    >
      <LinearGradient
        colors={['#1A1A2E', '#2A2A3E']}
        style={styles.gradient}
      >
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <Lock size={18} color={colors.primary} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.title}>{title}</Text>
            {!compact && <Text style={styles.sub}>{quotaSubtitle}</Text>}
            <View style={styles.partnerRow}>
              <ShoppingBag size={12} color={colors.saffron} />
              <Text style={styles.partnerText}>
                Blinkit · Zepto · Instamart · Zomato · Swiggy
              </Text>
            </View>
          </View>
          <Text style={styles.cta}>Upgrade →</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.lg,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  wrapCompact: {
    marginTop: spacing.md,
  },
  gradient: {
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,107,53,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.white,
  },
  sub: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.75)',
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  partnerText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.saffron,
  },
  cta: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
});
