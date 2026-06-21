import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Sparkles, X, Zap } from 'lucide-react-native';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TrialPartnerBanner from '@/components/TrialPartnerBanner';
import SmoothModal from '@/components/ui/SmoothModal';
import { FOOD_DELIVERY_DISCLOSURE, PARTNER_CHECKOUT_SUPPORT_NOTE } from '@/constants/monetization';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { usePartners } from '@/context/PartnersContext';
import type { FoodDeliveryPartner } from '@/utils/affiliate';

interface FoodDeliveryModalProps {
  visible: boolean;
  onClose: () => void;
  recipeTitle: string;
  prepTime?: number;
}

export default function FoodDeliveryModal({
  visible,
  onClose,
  recipeTitle,
  prepTime,
}: FoodDeliveryModalProps) {
  const [loading, setLoading] = useState<FoodDeliveryPartner | null>(null);
  const { partnersInTrialMode } = useAppContext();
  const { deliveryPartners, openFoodDelivery: openDeliveryPartner } = usePartners();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const maxBodyScrollHeight = windowHeight * 0.52;

  const handleOrder = async (partner: FoodDeliveryPartner) => {
    setLoading(partner);
    try {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await openDeliveryPartner(partner, recipeTitle);
      onClose();
    } finally {
      setLoading(null);
    }
  };

  return (
    <SmoothModal visible={visible} onClose={onClose} variant="sheet">
      <View style={[styles.sheet, { paddingBottom: insets.bottom }]}>
          <LinearGradient
            colors={['#1A1A2E', '#2D1B4E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sheetHero}
          >
            <View style={styles.handle} />
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
              <X size={22} color={colors.white} />
            </Pressable>
            <View style={styles.heroBadge}>
              <Sparkles size={12} color={colors.saffron} />
              <Text style={styles.heroBadgeText}>Recommended tonight</Text>
            </View>
            <Text style={styles.heroTitle}>Skip cooking?</Text>
            <Text style={styles.heroSub}>
              Search restaurants on Zomato or Swiggy inspired by &quot;{recipeTitle}&quot;.
            </Text>
            {prepTime != null && (
              <View style={styles.saveRow}>
                <Clock size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.saveText}>
                  Save ~{prepTime} min vs cooking at home
                </Text>
              </View>
            )}
          </LinearGradient>

          <ScrollView
            style={[styles.bodyScroll, { maxHeight: maxBodyScrollHeight }]}
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
            bounces
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {partnersInTrialMode && <TrialPartnerBanner />}
            <Text style={styles.pickLabel}>Pick a delivery partner</Text>

            {deliveryPartners.map((partner) => (
              <Pressable
                key={partner.id}
                onPress={() => void handleOrder(partner.id)}
                disabled={loading !== null}
                style={({ pressed }) => [
                  styles.partnerBtn,
                  { backgroundColor: partner.accent },
                  pressed && styles.partnerBtnPressed,
                  loading === partner.id && styles.partnerBtnLoading,
                ]}
              >
                <Text style={styles.partnerBtnLabel}>
                  {loading === partner.id ? 'Opening…' : `Order on ${partner.label}`}
                </Text>
                <Text style={styles.partnerBtnSub}>{partner.tagline}</Text>
              </Pressable>
            ))}

            <View style={styles.freeRow}>
              <Zap size={12} color={colors.green} />
              <Text style={styles.freeText}>{PARTNER_CHECKOUT_SUPPORT_NOTE}</Text>
            </View>
            <Text style={styles.disclosure}>{FOOD_DELIVERY_DISCLOSURE}</Text>
          </ScrollView>
        </View>
    </SmoothModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    width: '100%',
    borderTopLeftRadius: radius.xl + 4,
    borderTopRightRadius: radius.xl + 4,
    overflow: 'hidden',
    backgroundColor: colors.cream,
  },
  sheetHero: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.lg,
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
    backgroundColor: 'rgba(255,153,51,0.25)',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.saffron,
  },
  heroTitle: {
    marginTop: spacing.md,
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
  },
  heroSub: {
    marginTop: spacing.sm,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.85)',
  },
  saveRow: {
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
  saveText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
  },
  bodyScroll: {
    flexGrow: 0,
  },
  body: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  pickLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.muted,
    marginBottom: spacing.md,
  },
  partnerBtn: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    alignItems: 'center',
    ...shadows.cardLifted,
  },
  partnerBtnPressed: {
    opacity: 0.92,
  },
  partnerBtnLoading: {
    opacity: 0.75,
  },
  partnerBtnLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.white,
  },
  partnerBtnSub: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
  freeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  freeText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: colors.green,
    lineHeight: 15,
    textAlign: 'center',
  },
  disclosure: {
    marginTop: spacing.sm,
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
    color: colors.muted,
  },
});
