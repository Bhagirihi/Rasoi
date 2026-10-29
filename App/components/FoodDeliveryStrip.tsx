import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Clock, Sparkles, UtensilsCrossed } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows, spacing } from '@/constants/theme';

interface FoodDeliveryStripProps {
  recipeTitle: string;
  prepTime?: number;
  onOrderPress: () => void;
}

export default function FoodDeliveryStrip({
  recipeTitle,
  prepTime,
  onOrderPress,
}: FoodDeliveryStripProps) {
  return (
    <Pressable
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onOrderPress();
      }}
      style={({ pressed }) => [styles.wrap, pressed && styles.wrapPressed]}
    >
      <LinearGradient
        colors={['#E23744', '#FC8019', '#FF6B35']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.topAccent} />

        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Sparkles size={12} color={colors.white} />
            <Text style={styles.badgeText}>Easier tonight</Text>
          </View>
          {prepTime != null && (
            <View style={styles.timeBadge}>
              <Clock size={12} color={colors.white} />
              <Text style={styles.timeBadgeText}>Save {prepTime} min</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.iconWrap}>
            <UtensilsCrossed size={22} color={colors.white} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.title}>Skip cooking?</Text>
            <Text style={styles.sub} numberOfLines={2}>
              Search Zomato or Swiggy for dishes inspired by {recipeTitle}.
            </Text>
            <Text style={styles.cta}>Browse delivery →</Text>
          </View>
          <View style={styles.arrowWrap}>
            <ChevronRight size={22} color={colors.white} />
          </View>
        </View>

        <View style={styles.partnerRow}>
          <View style={styles.partnerPill}>
            <Text style={styles.partnerPillText}>Zomato</Text>
          </View>
          <View style={styles.partnerPill}>
            <Text style={styles.partnerPillText}>Swiggy</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.lg,
    borderRadius: radius.lg + 2,
    overflow: 'hidden',
    ...shadows.cardLifted,
  },
  wrapPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.99 }],
  },
  gradient: {
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: radius.lg + 2,
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.white,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
  },
  timeBadgeText: {
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
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    color: 'rgba(255,255,255,0.9)',
  },
  cta: {
    marginTop: spacing.sm,
    fontSize: 14,
    fontWeight: '800',
    color: colors.white,
    textDecorationLine: 'underline',
  },
  arrowWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
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
  },
  partnerPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.charcoal,
  },
});
