import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { ShoppingBag, Sparkles, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { REVENUE_DISCLOSURE } from '@/constants/monetization';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import TrialPartnerBanner from '@/components/TrialPartnerBanner';
import SmoothModal from '@/components/ui/SmoothModal';
import { useAppContext } from '@/context/AppContext';
import { usePartners } from '@/context/PartnersContext';
import type { AffiliatePartner } from '@/utils/affiliate';

interface AffiliateCheckoutModalProps {
  visible: boolean;
  onClose: () => void;
  recipeTitle?: string;
  recipeId?: string;
  missingIngredients: string[];
  initialPartner?: AffiliatePartner;
}

export default function AffiliateCheckoutModal({
  visible,
  onClose,
  recipeTitle,
  recipeId,
  missingIngredients,
  initialPartner = 'blinkit',
}: AffiliateCheckoutModalProps) {
  const [loading, setLoading] = useState<AffiliatePartner | null>(null);
  const { partnersInTrialMode } = useAppContext();
  const { groceryPartners, openGroceryCheckout } = usePartners();

  useEffect(() => {
    if (!visible) setLoading(null);
  }, [visible]);

  const handleCheckout = async (partner: AffiliatePartner) => {
    if (missingIngredients.length === 0) return;
    setLoading(partner);
    try {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await openGroceryCheckout(partner, missingIngredients, {
        context: 'recipe_checkout',
        recipeId,
      });
      onClose();
    } finally {
      setLoading(null);
    }
  };

  return (
    <SmoothModal visible={visible} onClose={onClose} variant="sheet">
      <View style={styles.sheet}>
          <LinearGradient
            colors={['#1A1A2E', '#1A3D2E', '#2D1B4E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sheetHero}
          >
            <View style={styles.handle} />
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
              <X size={22} color={colors.white} />
            </Pressable>
            <View style={styles.heroBadge}>
              <Sparkles size={12} color="#F8CB46" />
              <Text style={styles.heroBadgeText}>Quick grocery run</Text>
            </View>
            <Text style={styles.heroTitle}>Get ingredients delivered</Text>
            <Text style={styles.heroSub}>
              {recipeTitle
                ? `Everything for ${recipeTitle} — at your door in minutes.`
                : 'Fill your cart in one tap from India\'s fastest apps.'}
            </Text>
            {missingIngredients.length > 0 && (
              <View style={styles.countRow}>
                <ShoppingBag size={14} color="rgba(255,255,255,0.85)" />
                <Text style={styles.countText}>
                  {missingIngredients.length} item{missingIngredients.length !== 1 ? 's' : ''} to add
                </Text>
              </View>
            )}
          </LinearGradient>

          <View style={styles.body}>
            {partnersInTrialMode && <TrialPartnerBanner />}

            {missingIngredients.length > 0 && (
              <>
                <Text style={styles.pickLabel}>Your shopping list</Text>
                <View style={styles.chipGrid}>
                  {missingIngredients.map((item) => (
                    <View key={item} style={styles.missingChip}>
                      <View style={styles.missingChipDot} />
                      <Text style={styles.missingChipText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            <Text style={styles.pickLabel}>Pick a delivery partner</Text>

            {groceryPartners.map((partner) => (
              <Pressable
                key={partner.id}
                onPress={() => void handleCheckout(partner.id)}
                disabled={loading !== null || missingIngredients.length === 0}
                style={({ pressed }) => [
                  styles.partnerBtn,
                  { backgroundColor: partner.accent },
                  pressed && styles.partnerBtnPressed,
                  loading === partner.id && styles.partnerBtnLoading,
                  missingIngredients.length === 0 && styles.partnerBtnDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.partnerBtnLabel,
                    { color: partner.textOnAccent },
                  ]}
                >
                  {loading === partner.id
                    ? 'Opening cart…'
                    : `Checkout on ${partner.label}`}
                </Text>
                <Text
                  style={[
                    styles.partnerBtnSub,
                    { color: partner.textOnAccent, opacity: 0.85 },
                  ]}
                >
                  {partner.delivery} delivery
                </Text>
              </Pressable>
            ))}

            <Text style={styles.disclosure}>{REVENUE_DISCLOSURE}</Text>
          </View>
        </View>
    </SmoothModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: radius.xl + 4,
    borderTopRightRadius: radius.xl + 4,
    overflow: 'hidden',
    backgroundColor: colors.cream,
    maxHeight: '88%',
  },
  sheetHero: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
    marginBottom: spacing.lg,
  },
  closeBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.lg,
    padding: spacing.xs,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(248,203,70,0.25)',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#F8CB46',
  },
  heroTitle: {
    marginTop: spacing.md,
    fontSize: 26,
    fontWeight: '800',
    color: colors.white,
  },
  heroSub: {
    marginTop: spacing.sm,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.85)',
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
  },
  body: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  pickLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.muted,
    marginBottom: spacing.md,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  missingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,107,53,0.4)',
    backgroundColor: 'rgba(255,107,53,0.08)',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  missingChipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  missingChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.charcoal,
  },
  partnerBtn: {
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    ...shadows.cardLifted,
  },
  partnerBtnPressed: {
    opacity: 0.92,
  },
  partnerBtnLoading: {
    opacity: 0.75,
  },
  partnerBtnDisabled: {
    opacity: 0.45,
  },
  partnerBtnLabel: {
    fontSize: 17,
    fontWeight: '800',
  },
  partnerBtnSub: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  freeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  freeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.green,
  },
  disclosure: {
    marginTop: spacing.sm,
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
    color: colors.muted,
  },
});
