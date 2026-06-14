import { LinearGradient } from 'expo-linear-gradient';
import { ChefHat, ShoppingCart, X } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import SmoothModal from '@/components/ui/SmoothModal';
import type { Recipe } from '@/data/mockRecipes';
import { colors, radius, spacing } from '@/constants/theme';

type CookTonightSheetProps = {
  visible: boolean;
  recipe: Recipe | null;
  missing: string[];
  pickReason: string;
  pantryMatchPercent: number;
  showShop: boolean;
  title?: string;
  onClose: () => void;
  onStartCooking: () => void;
  onShopMissing?: () => void;
};

export default function CookTonightSheet({
  visible,
  recipe,
  missing,
  pickReason,
  pantryMatchPercent,
  showShop,
  title = 'Cook tonight',
  onClose,
  onStartCooking,
  onShopMissing,
}: CookTonightSheetProps) {
  if (!recipe) return null;

  return (
    <SmoothModal visible={visible} onClose={onClose} variant="sheet">
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <X size={22} color={colors.muted} />
          </Pressable>
        </View>

        <Text style={styles.recipeName}>{recipe.title}</Text>
        <Text style={styles.reason}>{pickReason}</Text>
        <Text style={styles.meta}>
          {recipe.prepTime} min · {pantryMatchPercent}% pantry match · {recipe.dietType}
        </Text>

        {missing.length > 0 ? (
          <View style={styles.missingBox}>
            <Text style={styles.missingTitle}>
              Missing {missing.length} item{missing.length === 1 ? '' : 's'}
            </Text>
            <Text style={styles.missingList}>{missing.slice(0, 6).join(' · ')}</Text>
          </View>
        ) : (
          <View style={styles.readyBox}>
            <Text style={styles.readyText}>You have everything — ready to cook.</Text>
          </View>
        )}

        <Pressable onPress={onStartCooking} style={styles.primaryWrap}>
          <LinearGradient
            colors={[colors.primary, colors.saffron]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.primaryBtn}
          >
            <ChefHat size={18} color={colors.white} />
            <Text style={styles.primaryText}>Start cooking</Text>
          </LinearGradient>
        </Pressable>

        {missing.length > 0 && showShop && onShopMissing && (
          <Pressable onPress={onShopMissing} style={styles.secondaryBtn}>
            <ShoppingCart size={16} color={colors.primary} />
            <Text style={styles.secondaryText}>Shop missing items</Text>
          </Pressable>
        )}
      </View>
    </SmoothModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.cream,
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.charcoal,
  },
  recipeName: {
    marginTop: spacing.md,
    fontSize: 22,
    fontWeight: '800',
    color: colors.charcoal,
  },
  reason: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 20,
    color: colors.primary,
    fontWeight: '600',
  },
  meta: {
    marginTop: 4,
    fontSize: 13,
    color: colors.muted,
  },
  missingBox: {
    marginTop: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,107,53,0.08)',
    padding: spacing.md,
  },
  missingTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.charcoal,
  },
  missingList: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 20,
    color: colors.muted,
  },
  readyBox: {
    marginTop: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: 'rgba(0,168,107,0.1)',
    padding: spacing.md,
  },
  readyText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.green,
  },
  primaryWrap: {
    marginTop: spacing.xl,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
  },
  secondaryBtn: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
});
