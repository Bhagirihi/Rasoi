import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Check, ChefHat, Package } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AdMobBanner from '@/components/AdMobBanner';
import AffiliateCheckoutModal from '@/components/AffiliateCheckoutModal';
import { AppTabHeader } from '@/components/AppTabHeader';
import GroceryPromoStrip from '@/components/GroceryPromoStrip';
import PartnerUpsellCard from '@/components/PartnerUpsellCard';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import SponsorRail from '@/components/SponsorRail';
import TrialPartnerBanner from '@/components/TrialPartnerBanner';
import { PrimaryButton } from '@/components/ui/Primitives';
import { usePlacementSponsor } from '@/hooks/usePlacementSponsor';
import { colors, layout, radius, scrollIndicator, shadows, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { usePartners } from '@/context/PartnersContext';
import { useRecipes } from '@/context/RecipesContext';
import { useReferenceData } from '@/context/ReferenceContext';
import { countFullyStockedRecipes } from '@/utils/recipes';
import type { AffiliatePartner } from '@/utils/affiliate';
import { dietChoiceToFilter } from '@/utils/storage';

const RESTOCK_SUGGESTIONS = ['Paneer', 'Tamatar', 'Dahi', 'Mirch'];

export default function PantryScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const {
    pantryIngredients,
    togglePantryIngredient,
    setPantryFilterActive,
    regionalCuisine,
    dietChoice,
    showPartners,
    partnersInTrialMode,
  } = useAppContext();
  const { recipes } = useRecipes();
  const { pantrySections } = useReferenceData();
  const { openGroceryCheckout } = usePartners();

  const [modalVisible, setModalVisible] = useState(false);
  const { sponsor: pantrySponsor } = usePlacementSponsor('pantry');

  const matchCount = useMemo(
    () =>
      countFullyStockedRecipes(recipes, {
        dietPreference: dietChoiceToFilter(dietChoice),
        regionalCuisine,
        pantryIngredients,
      }),
    [recipes, dietChoice, regionalCuisine, pantryIngredients],
  );

  const restockItems = useMemo(
    () => RESTOCK_SUGGESTIONS.filter((item) => !pantryIngredients.includes(item)),
    [pantryIngredients],
  );

  const totalPantryItems = useMemo(
    () => pantrySections.reduce((sum, section) => sum + section.items.length, 0),
    [pantrySections],
  );

  const stockedPercent = useMemo(
    () =>
      totalPantryItems > 0
        ? Math.round((pantryIngredients.length / totalPantryItems) * 100)
        : 0,
    [pantryIngredients.length, totalPantryItems],
  );

  const handleToggle = (item: string) => {
    void Haptics.selectionAsync();
    togglePantryIngredient(item);
  };

  const handleFindRecipes = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPantryFilterActive(true);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollViewWithFloatingIndicator
        floatingBottomOffset={tabBarHeight + 72}
        floatingLabel="More pantry"
        {...scrollIndicator}
        contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + 120 }]}
      >
        <AppTabHeader
          title="Your pantry"
          subtitle="Tap what you have at home — we'll show recipes you can cook and what to order."
        />

        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Pantry snapshot</Text>
            <Text style={styles.statsPercent}>{stockedPercent}% filled</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${stockedPercent}%` }]} />
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIconWrap, styles.statIconWrapGreen]}>
                <Package size={18} color={colors.green} strokeWidth={2.5} />
              </View>
              <View style={styles.statCopy}>
                <Text style={styles.statValue}>{pantryIngredients.length}</Text>
                <Text style={styles.statLabel}>Ingredients at home</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={[styles.statIconWrap, styles.statIconWrapOrange]}>
                <ChefHat size={18} color={colors.primary} strokeWidth={2.5} />
              </View>
              <View style={styles.statCopy}>
                <Text style={[styles.statValue, styles.statValueAccent]}>{matchCount}</Text>
                <Text style={styles.statLabel}>Recipes ready to cook</Text>
              </View>
            </View>
          </View>
        </View>

        {restockItems.length > 0 && (
          showPartners ? (
            <>
              {partnersInTrialMode && <TrialPartnerBanner />}
              <GroceryPromoStrip
                onShopPress={() => setModalVisible(true)}
                onPartnerPress={(partner) => {
                  void openGroceryCheckout(partner, restockItems);
                }}
                missingCount={restockItems.length}
                title="Restock your pantry"
                subtitle={`Order ${restockItems.join(', ')} in minutes`}
                hidePartnerBranding
                ctaText="Restock now →"
              />
            </>
          ) : (
            <PartnerUpsellCard
              title="Restock via quick commerce"
              subtitle="Order pantry staples in minutes with Rasoi Plus"
            />
          )
        )}

        <AdMobBanner placement="pantry" />

        {pantrySponsor && <SponsorRail {...pantrySponsor} compact />}

        {pantrySections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.grid}>
              {section.items.map((item) => {
                const isSelected = pantryIngredients.includes(item);
                return (
                  <Pressable
                    key={item}
                    onPress={() => handleToggle(item)}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                  >
                    {isSelected && <Check size={14} color={colors.green} strokeWidth={3} />}
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollViewWithFloatingIndicator>

      <SafeAreaView edges={['bottom']} style={styles.stickyBar}>
        <View style={styles.stickyInner}>
          <View style={styles.stickyMeta}>
            <Text style={styles.stickyMetaValue}>{matchCount}</Text>
            <Text style={styles.stickyMetaLabel}>recipes ready to cook</Text>
          </View>
          <PrimaryButton
            label="Find matching recipes"
            onPress={handleFindRecipes}
            style={styles.stickyBtn}
          />
        </View>
      </SafeAreaView>

      <AffiliateCheckoutModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        missingIngredients={restockItems}
        recipeTitle="Pantry restock"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  flex: { flex: 1 },
  content: {
    paddingHorizontal: layout.screenPadding,
  },
  statsCard: {
    marginTop: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.card,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.charcoal,
  },
  statsPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.green,
  },
  progressTrack: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,168,107,0.12)',
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.green,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconWrapGreen: {
    backgroundColor: 'rgba(0,168,107,0.1)',
  },
  statIconWrapOrange: {
    backgroundColor: 'rgba(255,82,0,0.1)',
  },
  statCopy: {
    flex: 1,
  },
  statDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.green,
    lineHeight: 28,
  },
  statValueAccent: {
    color: colors.primary,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '600',
    color: colors.muted,
    lineHeight: 14,
  },
  section: { marginTop: spacing.xxl },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.charcoal,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: '30%',
    justifyContent: 'center',
    borderRadius: radius.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  chipSelected: {
    borderColor: colors.green,
    borderWidth: 2,
    backgroundColor: 'rgba(0,168,107,0.08)',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.charcoal,
  },
  chipTextSelected: {
    color: colors.green,
  },
  stickyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    ...shadows.cardLifted,
  },
  stickyInner: {
    gap: spacing.sm,
  },
  stickyMeta: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  stickyMetaValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  stickyMetaLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },
  stickyBtn: {
    marginBottom: spacing.sm,
  },
});
