import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowRight, Check, ChefHat, Package, Sparkles } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AffiliateCheckoutModal from '@/components/AffiliateCheckoutModal';
import { AppTabHeader } from '@/components/AppTabHeader';
import GroceryPromoStrip from '@/components/GroceryPromoStrip';
import PartnerUpsellCard from '@/components/PartnerUpsellCard';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import SponsorOrAd from '@/components/SponsorOrAd';
import TrialPartnerBanner from '@/components/TrialPartnerBanner';
import { InsightBanner, PrimaryButton } from '@/components/ui/Primitives';
import { usePlacementSponsor } from '@/hooks/usePlacementSponsor';
import { colors, gradients, layout, radius, scrollIndicator, shadows, spacing } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import { useTheme } from '@/context/ThemeContext';
import { useAppContext } from '@/context/AppContext';
import { usePartners } from '@/context/PartnersContext';
import { useRecipes } from '@/context/RecipesContext';
import { useReferenceData } from '@/context/ReferenceContext';
import { countFullyStockedRecipes } from '@/utils/recipes';
import type { AffiliatePartner } from '@/utils/affiliate';
import { dietChoiceToFilter } from '@/utils/storage';

const RESTOCK_SUGGESTIONS = ['Paneer', 'Tamatar', 'Dahi', 'Mirch'];

function countStockedInSection(items: string[], pantryIngredients: string[]) {
  return items.filter((item) => pantryIngredients.includes(item)).length;
}

export default function PantryScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { colors: themeColors, isDark } = useTheme();
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
  const [stickyBarHeight, setStickyBarHeight] = useState(96);
  const { sponsor: pantrySponsor, loading: pantrySponsorLoading } = usePlacementSponsor('pantry');

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

  const scrollBottomPadding = stickyBarHeight + tabBarHeight + spacing.lg;

  const handleToggle = (item: string) => {
    void Haptics.selectionAsync();
    togglePantryIngredient(item);
  };

  const handleFindRecipes = () => {
    if (matchCount === 0) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPantryFilterActive(true);
    router.replace('/(tabs)/recipes');
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: themeColors.cream }]}
      edges={['top']}
      testID={testIds.screenPantry}
    >
      <ScrollViewWithFloatingIndicator
        {...scrollIndicator}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: scrollBottomPadding }]}
      >
        <View style={styles.screenSections}>
          <AppTabHeader
            eyebrow="Pantry checker"
            title="What's at home"
            subtitle="Tap ingredients you have — we'll match recipes and flag what to restock."
          />

          <View
            style={[
              styles.statsCard,
              { backgroundColor: themeColors.white, borderColor: themeColors.border },
            ]}
          >
            <LinearGradient
              colors={gradients.header}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.statsAccent}
            />
            <View style={styles.statsHeader}>
              <View>
                <Text style={[styles.statsEyebrow, { color: themeColors.muted }]}>Pantry snapshot</Text>
                <Text style={[styles.statsTitle, { color: themeColors.charcoal }]}>
                  {pantryIngredients.length} of {totalPantryItems} stocked
                </Text>
              </View>
              <View style={[styles.percentBadge, { backgroundColor: isDark ? 'rgba(0,168,107,0.18)' : 'rgba(0,168,107,0.1)' }]}>
                <Text style={styles.percentBadgeText}>{stockedPercent}%</Text>
              </View>
            </View>

            <View
              style={[
                styles.progressTrack,
                { backgroundColor: isDark ? 'rgba(0,168,107,0.22)' : 'rgba(0,168,107,0.12)' },
              ]}
            >
              <View style={[styles.progressFill, { width: `${Math.max(stockedPercent, 4)}%` }]} />
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View
                  style={[
                    styles.statIconWrap,
                    { backgroundColor: isDark ? 'rgba(0,168,107,0.18)' : 'rgba(0,168,107,0.1)' },
                  ]}
                >
                  <Package size={18} color={colors.green} strokeWidth={2.5} />
                </View>
                <View style={styles.statCopy}>
                  <Text style={styles.statValue}>{pantryIngredients.length}</Text>
                  <Text style={[styles.statLabel, { color: themeColors.muted }]}>At home</Text>
                </View>
              </View>
              <View style={[styles.statDivider, { backgroundColor: themeColors.border }]} />
              <View style={styles.statItem}>
                <View
                  style={[
                    styles.statIconWrap,
                    { backgroundColor: isDark ? 'rgba(255,107,53,0.18)' : 'rgba(255,107,53,0.1)' },
                  ]}
                >
                  <ChefHat size={18} color={colors.primary} strokeWidth={2.5} />
                </View>
                <View style={styles.statCopy}>
                  <Text style={[styles.statValue, styles.statValueAccent]}>{matchCount}</Text>
                  <Text style={[styles.statLabel, { color: themeColors.muted }]}>Ready to cook</Text>
                </View>
              </View>
            </View>
          </View>

          {pantryIngredients.length === 0 ? (
            <InsightBanner
              title="Start with what you already have"
              subtitle="Mark staples like atta, rice, and masala — even a few items unlock better recipe matches."
            />
          ) : matchCount > 0 ? (
            <InsightBanner
              title={`${matchCount} recipe${matchCount === 1 ? '' : 's'} match your pantry`}
              subtitle="Use the button below to browse dishes you can cook right now."
            />
          ) : null}

          {restockItems.length > 0 &&
            (showPartners ? (
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
            ))}

          <View style={styles.ingredientsHeader}>
            <Text style={[styles.ingredientsTitle, { color: themeColors.charcoal }]}>Ingredients</Text>
            <Text style={[styles.ingredientsHint, { color: themeColors.muted }]}>
              Tap to toggle · green = in stock
            </Text>
          </View>

          {pantrySections.map((section) => {
            const stockedInSection = countStockedInSection(section.items, pantryIngredients);
            const sectionComplete = stockedInSection === section.items.length;

            return (
              <View
                key={section.title}
                style={[
                  styles.sectionCard,
                  { backgroundColor: themeColors.white, borderColor: themeColors.border },
                ]}
              >
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleRow}>
                    <Text style={[styles.sectionTitle, { color: themeColors.charcoal }]}>
                      {section.title}
                    </Text>
                    {sectionComplete && (
                      <View style={styles.sectionCompleteBadge}>
                        <Check size={12} color={colors.green} strokeWidth={3} />
                      </View>
                    )}
                  </View>
                  <View
                    style={[
                      styles.sectionCountBadge,
                      {
                        backgroundColor: sectionComplete
                          ? isDark
                            ? 'rgba(0,168,107,0.18)'
                            : 'rgba(0,168,107,0.1)'
                          : isDark
                            ? 'rgba(107,114,128,0.16)'
                            : 'rgba(107,114,128,0.08)',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sectionCountText,
                        { color: sectionComplete ? colors.green : themeColors.muted },
                      ]}
                    >
                      {stockedInSection}/{section.items.length}
                    </Text>
                  </View>
                </View>

                <View style={styles.grid}>
                  {section.items.map((item) => {
                    const isSelected = pantryIngredients.includes(item);
                    return (
                      <Pressable
                        key={item}
                        onPress={() => handleToggle(item)}
                        style={[
                          styles.chip,
                          {
                            backgroundColor: isSelected
                              ? isDark
                                ? 'rgba(0,168,107,0.16)'
                                : 'rgba(0,168,107,0.08)'
                              : themeColors.cream,
                            borderColor: isSelected ? colors.green : themeColors.border,
                          },
                        ]}
                      >
                        {isSelected ? (
                          <View style={styles.chipCheck}>
                            <Check size={11} color={colors.white} strokeWidth={3} />
                          </View>
                        ) : (
                          <View style={[styles.chipDot, { borderColor: themeColors.border }]} />
                        )}
                        <Text
                          style={[
                            styles.chipText,
                            { color: isSelected ? colors.green : themeColors.charcoal },
                          ]}
                          numberOfLines={1}
                        >
                          {item}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          })}

          <View style={styles.sponsorSlot}>
            <SponsorOrAd
              sponsor={pantrySponsor}
              loading={pantrySponsorLoading}
              placement="pantry"
              compact
            />
          </View>
        </View>
      </ScrollViewWithFloatingIndicator>

      <SafeAreaView
        edges={['bottom']}
        style={[
          styles.stickyBar,
          { backgroundColor: themeColors.white, borderTopColor: themeColors.border },
        ]}
        onLayout={(event) => {
          const height = event.nativeEvent.layout.height;
          if (height > 0 && Math.abs(height - stickyBarHeight) > 2) {
            setStickyBarHeight(height);
          }
        }}
      >
        <View style={styles.stickyInner}>
          <View style={styles.stickyMeta}>
            <View style={styles.stickyMetaIcon}>
              <Sparkles size={16} color={colors.primary} />
            </View>
            <View style={styles.stickyMetaCopy}>
              <Text style={styles.stickyMetaValue}>
                {matchCount > 0 ? matchCount : '—'}
              </Text>
              <Text style={[styles.stickyMetaLabel, { color: themeColors.muted }]}>
                {matchCount === 1 ? 'recipe ready' : 'recipes ready'}
              </Text>
            </View>
          </View>
          <PrimaryButton
            label={matchCount > 0 ? 'Find recipes' : 'Add more items'}
            icon={matchCount > 0 ? ArrowRight : undefined}
            onPress={handleFindRecipes}
            disabled={matchCount === 0}
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
  safe: { flex: 1 },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
  },
  screenSections: {
    gap: spacing.xl,
  },
  statsCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    overflow: 'hidden',
    ...shadows.card,
  },
  statsAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  statsEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  statsTitle: {
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
  },
  percentBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  percentBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.green,
  },
  progressTrack: {
    height: 8,
    borderRadius: radius.pill,
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
  statCopy: {
    flex: 1,
  },
  statDivider: {
    width: 1,
    alignSelf: 'stretch',
    marginHorizontal: spacing.md,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.green,
    lineHeight: 26,
  },
  statValueAccent: {
    color: colors.primary,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 15,
  },
  ingredientsHeader: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  ingredientsHint: {
    fontSize: 13,
    fontWeight: '500',
  },
  sectionCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  sectionCompleteBadge: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,168,107,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCountBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  sectionCountText: {
    fontSize: 12,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    maxWidth: '100%',
  },
  chipCheck: {
    width: 18,
    height: 18,
    borderRadius: radius.pill,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipDot: {
    width: 18,
    height: 18,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    flexShrink: 1,
  },
  sponsorSlot: {
    marginTop: spacing.sm,
  },
  stickyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    ...shadows.cardLifted,
  },
  stickyInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  stickyMeta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 0,
  },
  stickyMetaIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,107,53,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickyMetaCopy: {
    flex: 1,
    minWidth: 0,
  },
  stickyMetaValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    lineHeight: 24,
  },
  stickyMetaLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  stickyBtn: {
    flexShrink: 0,
    minWidth: 148,
  },
});
