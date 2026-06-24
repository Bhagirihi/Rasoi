import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useMemo, useState, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AffiliateCheckoutModal from '@/components/AffiliateCheckoutModal';
import { AppTabHeader } from '@/components/AppTabHeader';
import GroceryPromoStrip from '@/components/GroceryPromoStrip';
import { PantryHeroCard } from '@/components/pantry/PantryHeroCard';
import { PantrySectionCard } from '@/components/pantry/PantrySectionCard';
import { PANTRY_BASE_SECTION_TITLES } from '@/components/pantry/pantrySectionMeta';
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
import { useTheme } from '@/context/ThemeContext';
import { useAppContext } from '@/context/AppContext';
import { pantryHasIngredient } from '@/utils/pantryCanonical';
import type { AffiliatePartner } from '@/utils/affiliate';

function PantrySectionLabel({
  title,
  hint,
  inline = false,
}: {
  title: string;
  hint?: string;
  inline?: boolean;
}) {
  const { colors: themeColors } = useTheme();
  if (inline && hint) {
    return (
      <View style={styles.sectionLabelInline}>
        <Text style={[styles.sectionLabelTitle, { color: themeColors.charcoal }]}>{title}</Text>
        <Text style={[styles.sectionLabelDot, { color: themeColors.muted }]}>·</Text>
        <Text style={[styles.sectionLabelHintInline, { color: themeColors.muted }]} numberOfLines={1}>
          {hint}
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.sectionLabel}>
      <Text style={[styles.sectionLabelTitle, { color: themeColors.charcoal }]}>{title}</Text>
      {hint ? (
        <Text style={[styles.sectionLabelHint, { color: themeColors.muted }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

export default function PantryScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { colors: themeColors } = useTheme();
  const {
    pantryIngredients,
    togglePantryIngredient,
    setPantryFilterActive,
    showPartners,
    partnersInTrialMode,
    pendingPantrySetup,
    clearPendingPantrySetup,
    dietChoice,
  } = useAppContext();
  const { essentialSections, preferenceSummary, personalSection, stockStats, restockItems, matchCount } =
    usePantryScreenData();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalPartner, setModalPartner] = useState<AffiliatePartner>('blinkit');
  const [stickyBarHeight, setStickyBarHeight] = useState(96);
  const { sponsor: pantrySponsor, loading: pantrySponsorLoading } = usePlacementSponsor('pantry');

  const { baseSections, cuisineSections } = useMemo(() => {
    const base = essentialSections.filter((section) => PANTRY_BASE_SECTION_TITLES.has(section.title));
    const cuisine = essentialSections.filter((section) => !PANTRY_BASE_SECTION_TITLES.has(section.title));
    return { baseSections: base, cuisineSections: cuisine };
  }, [essentialSections]);

  useDismissOnBlur(useCallback(() => setModalVisible(false), []));

  const scrollBottomPadding = stickyBarHeight + tabBarHeight + spacing.lg;
  const setupSelectedCount = pantryIngredients.length;

  const handleToggle = (item: string) => {
    void Haptics.selectionAsync();
    togglePantryIngredient(item);
  };

  const handleAddAll = (items: string[]) => {
    for (const item of items) {
      if (!pantryHasIngredient(pantryIngredients, item)) {
        togglePantryIngredient(item);
      }
    }
  };

  const handleCookMatches = () => {
    if (matchCount === 0) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPantryFilterActive(true);
    router.replace('/(tabs)/recipes');
  };

  const handleBrowseRecipes = () => {
    void Haptics.selectionAsync();
    setPantryFilterActive(false);
    router.replace('/(tabs)/recipes');
  };

  const handleFinishPantrySetup = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    clearPendingPantrySetup();
    router.replace('/(tabs)');
  };

  const handleSkipPantrySetup = () => {
    void Haptics.selectionAsync();
    clearPendingPantrySetup();
    router.replace('/(tabs)');
  };

  const stickyCta = useMemo(() => {
    if (matchCount > 0) {
      return {
        label: `Cook ${matchCount} ready recipe${matchCount === 1 ? '' : 's'}`,
        hint: 'Matched to what you have at home',
        onPress: handleCookMatches,
        disabled: false,
        showArrow: true,
      };
    }
    if (setupSelectedCount > 0) {
      return {
        label: 'Browse recipes',
        hint: `${stockStats.percent}% stocked — add more staples for better matches`,
        onPress: handleBrowseRecipes,
        disabled: false,
        showArrow: true,
      };
    }
    return {
      label: 'Select staples above',
      hint: 'We’ll show recipes you can cook',
      onPress: () => undefined,
      disabled: true,
      showArrow: false,
    };
  }, [matchCount, setupSelectedCount, stockStats.percent]);

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
            compact
            eyebrow={pendingPantrySetup ? 'Welcome to Rasoi' : 'Your kitchen'}
            title={pendingPantrySetup ? 'Stock your pantry' : "What's at home"}
            subtitle={
              pendingPantrySetup
                ? 'Tap what you keep at home.'
                : 'Tap staples — we match recipes to your diet and cuisines.'
            }
          />

          {pendingPantrySetup ? (
            <View
              style={[
                styles.setupBanner,
                { backgroundColor: themeColors.white, borderColor: 'rgba(255,107,53,0.28)' },
              ]}
            >
              <LinearGradient
                colors={gradients.header}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.setupBannerAccent}
              />
              <View style={styles.setupBannerRow}>
                <Text style={[styles.setupBannerTitle, { color: themeColors.charcoal }]}>
                  Pick staples for {preferenceSummary.headline}
                </Text>
                <Text style={[styles.setupBannerCount, { color: colors.primary }]}>
                  {setupSelectedCount === 0 ? '0' : setupSelectedCount}
                </Text>
              </View>
              <View style={styles.setupProgressTrack}>
                <View
                  style={[
                    styles.setupProgressFill,
                    {
                      width: `${Math.min(100, Math.max(setupSelectedCount > 0 ? 12 : 4, (setupSelectedCount / 6) * 100))}%`,
                    },
                  ]}
                />
              </View>
            </View>
          ) : null}

          {!pendingPantrySetup ? (
            <PantryHeroCard
              stocked={stockStats.stocked}
              total={stockStats.total}
              percent={stockStats.percent}
              matchCount={matchCount}
              preferenceSummary={preferenceSummary}
              dietChoice={dietChoice}
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

          <PantrySectionLabel
            title="Kitchen basics"
            hint="Everyday staples"
            inline
          />

          <View
            style={[
              styles.groupedPanel,
              { backgroundColor: themeColors.white, borderColor: themeColors.border },
            ]}
          >
            {baseSections.map((section, index) => (
              <PantrySectionCard
                key={section.title}
                section={section}
                pantryIngredients={pantryIngredients}
                onToggle={handleToggle}
                onAddAll={handleAddAll}
                setupMode={pendingPantrySetup}
                embedded
                dense
                showDivider={index > 0}
              />
            ))}
          </View>

          {cuisineSections.length > 0 ? (
            <>
              <PantrySectionLabel
                title="For your cuisines"
                hint={
                  preferenceSummary.cuisineLabels.length > 0
                    ? preferenceSummary.cuisineLabels.join(' · ')
                    : 'Extra items for your styles'
                }
                inline
              />
              <View style={styles.sectionStack}>
                {cuisineSections.map((section, index) => (
                  <PantrySectionCard
                    key={section.title}
                    section={section}
                    pantryIngredients={pantryIngredients}
                    onToggle={handleToggle}
                    onAddAll={handleAddAll}
                    collapsible
                    defaultCollapsed={index > 0}
                    setupMode={pendingPantrySetup}
                    dense
                  />
                ))}
              </View>
            </>
          ) : null}

          <PantrySectionLabel
            title="From your recipes"
            hint="Tonight's pick & saved"
            inline
          />

          {personalSection ? (
            <PantrySectionCard
              section={{ title: personalSection.title, items: personalSection.items }}
              pantryIngredients={pantryIngredients}
              onToggle={handleToggle}
              onAddAll={handleAddAll}
              accent
              subtitle={personalSection.subtitle}
              setupMode={pendingPantrySetup}
              dense
            />
          ) : (
            <InsightBanner
              title="Recipe picks show up here"
              subtitle="Save recipes or open Home — extra ingredients appear here."
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
          {pendingPantrySetup ? (
            <View style={styles.setupSticky}>
              <PrimaryButton
                label="Continue to Home"
                icon={ArrowRight}
                onPress={handleFinishPantrySetup}
                disabled={setupSelectedCount === 0}
                style={styles.stickyBtnWide}
              />
              <Pressable onPress={handleSkipPantrySetup} hitSlop={8} testID={testIds.pantrySetupSkip}>
                <Text style={[styles.setupSkip, { color: themeColors.muted }]}>Skip for now</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.stickyCtaBlock}>
              <Text style={[styles.stickyHint, { color: themeColors.muted }]}>{stickyCta.hint}</Text>
              <PrimaryButton
                label={stickyCta.label}
                icon={stickyCta.showArrow ? ArrowRight : undefined}
                onPress={stickyCta.onPress}
                disabled={stickyCta.disabled}
                style={styles.stickyBtnWide}
              />
            </View>
          )}
        </View>
      </SafeAreaView>

      <AffiliateCheckoutModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        missingIngredients={restockItems}
        initialPartner={modalPartner}
        variant="pantry"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
  },
  screenSections: {
    gap: spacing.md,
  },
  sectionLabel: {
    gap: 2,
  },
  sectionLabelInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: 0,
  },
  sectionLabelTitle: {
    fontSize: 16,
    fontWeight: '800',
    flexShrink: 0,
  },
  sectionLabelDot: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionLabelHintInline: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  sectionLabelHint: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  groupedPanel: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.card,
  },
  sectionStack: {
    gap: spacing.sm,
  },
  setupBanner: {
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    overflow: 'hidden',
    gap: spacing.xs,
    ...shadows.card,
  },
  setupBannerAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  setupBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  setupBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
  },
  setupProgressTrack: {
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,107,53,0.12)',
    overflow: 'hidden',
  },
  setupProgressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  setupBannerCount: {
    fontSize: 15,
    fontWeight: '800',
    minWidth: 20,
    textAlign: 'right',
  },
  setupSticky: {
    flex: 1,
    gap: spacing.xs,
  },
  setupSkip: {
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
    alignSelf: 'center',
  },
  stickyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.sm,
    ...shadows.cardLifted,
  },
  stickyInner: {
    paddingBottom: spacing.xs,
  },
  stickyCtaBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  stickyHint: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    textAlign: 'center',
  },
  stickyBtnWide: {
    width: '100%',
  },
});
