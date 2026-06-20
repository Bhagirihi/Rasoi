import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowRight, Check, ChefHat, Package, Sparkles } from 'lucide-react-native';
import { useState, useCallback } from 'react';
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
import { usePantryScreenData } from '@/hooks/usePantryScreenData';
import { useDismissOnBlur } from '@/hooks/useDismissOnBlur';
import { usePlacementSponsor } from '@/hooks/usePlacementSponsor';
import { colors, gradients, layout, radius, scrollIndicator, shadows, spacing } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import type { PantrySection } from '@/services/reference';
import { useTheme } from '@/context/ThemeContext';
import { useAppContext } from '@/context/AppContext';
import { pantryHasIngredient } from '@/utils/pantryCanonical';
import type { AffiliatePartner } from '@/utils/affiliate';

function countStockedInSection(items: string[], pantryIngredients: string[]) {
  return items.filter((item) => pantryHasIngredient(pantryIngredients, item)).length;
}

type PantrySectionCardProps = {
  section: PantrySection;
  pantryIngredients: string[];
  onToggle: (item: string) => void;
  accent?: boolean;
  subtitle?: string;
};

function PantrySectionCard({
  section,
  pantryIngredients,
  onToggle,
  accent = false,
  subtitle,
}: PantrySectionCardProps) {
  const { colors: themeColors, isDark } = useTheme();
  const stockedInSection = countStockedInSection(section.items, pantryIngredients);
  const sectionComplete = section.items.length > 0 && stockedInSection === section.items.length;

  return (
    <View
      style={[
        styles.sectionCard,
        accent && styles.sectionCardAccent,
        { backgroundColor: themeColors.white, borderColor: accent ? 'rgba(255,107,53,0.35)' : themeColors.border },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleBlock}>
          <View style={styles.sectionTitleRow}>
            <Text style={[styles.sectionTitle, { color: themeColors.charcoal }]}>{section.title}</Text>
            {sectionComplete && (
              <View style={styles.sectionCompleteBadge}>
                <Check size={12} color={colors.green} strokeWidth={3} />
              </View>
            )}
          </View>
          {subtitle ? (
            <Text style={[styles.sectionSubtitle, { color: themeColors.muted }]} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
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
          const isSelected = pantryHasIngredient(pantryIngredients, item);
          return (
            <Pressable
              key={item}
              onPress={() => onToggle(item)}
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
                style={[styles.chipText, { color: isSelected ? colors.green : themeColors.charcoal }]}
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
}

export default function PantryScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { colors: themeColors, isDark } = useTheme();
  const { pantryIngredients, togglePantryIngredient, setPantryFilterActive, showPartners, partnersInTrialMode } =
    useAppContext();
  const { essentialSections, personalSection, stockStats, restockItems, matchCount } = usePantryScreenData();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalPartner, setModalPartner] = useState<AffiliatePartner>('blinkit');
  const [stickyBarHeight, setStickyBarHeight] = useState(96);
  const { sponsor: pantrySponsor, loading: pantrySponsorLoading } = usePlacementSponsor('pantry');

  useDismissOnBlur(useCallback(() => setModalVisible(false), []));

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
            subtitle="Tick essentials, then items for your picks and saved recipes."
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
                  {stockStats.stocked} of {stockStats.total} stocked
                </Text>
              </View>
              <View
                style={[
                  styles.percentBadge,
                  { backgroundColor: isDark ? 'rgba(0,168,107,0.18)' : 'rgba(0,168,107,0.1)' },
                ]}
              >
                <Text style={styles.percentBadgeText}>{stockStats.percent}%</Text>
              </View>
            </View>

            <View
              style={[
                styles.progressTrack,
                { backgroundColor: isDark ? 'rgba(0,168,107,0.22)' : 'rgba(0,168,107,0.12)' },
              ]}
            >
              <View style={[styles.progressFill, { width: `${Math.max(stockStats.percent, 4)}%` }]} />
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
                  <Text style={styles.statValue}>{stockStats.stocked}</Text>
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
              title="Start with kitchen essentials"
              subtitle="Tick atta, chawal, oil, and masala — then check items for your lunch pick and saved recipes."
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
                    setModalPartner(partner);
                    setModalVisible(true);
                  }}
                  missingCount={restockItems.length}
                  title="Still missing"
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
            <Text style={[styles.ingredientsTitle, { color: themeColors.charcoal }]}>Essentials</Text>
            <Text style={[styles.ingredientsHint, { color: themeColors.muted }]}>
              Every kitchen · tap what you keep at home
            </Text>
          </View>

          {essentialSections.map((section) => (
            <PantrySectionCard
              key={section.title}
              section={section}
              pantryIngredients={pantryIngredients}
              onToggle={handleToggle}
            />
          ))}

          <View style={styles.ingredientsHeader}>
            <Text style={[styles.ingredientsTitle, { color: themeColors.charcoal }]}>Your recipes</Text>
            <Text style={[styles.ingredientsHint, { color: themeColors.muted }]}>
              From your meal pick, also-for cards & saved recipes
            </Text>
          </View>

          {personalSection ? (
            <PantrySectionCard
              section={{ title: personalSection.title, items: personalSection.items }}
              pantryIngredients={pantryIngredients}
              onToggle={handleToggle}
              accent
              subtitle={personalSection.subtitle}
            />
          ) : (
            <InsightBanner
              title="Personal picks appear here"
              subtitle="Open Home for your meal pick, or save recipes — we'll show extra ingredients to stock."
            />
          )}

          <SponsorOrAd
            sponsor={pantrySponsor}
            loading={pantrySponsorLoading}
            placement="pantry"
            compact
          />
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
              <Text style={styles.stickyMetaValue}>{matchCount > 0 ? matchCount : '—'}</Text>
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
        initialPartner={modalPartner}
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
  sectionCardAccent: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  sectionTitleBlock: {
    flex: 1,
    gap: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
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
