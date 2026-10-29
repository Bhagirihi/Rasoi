import * as Haptics from 'expo-haptics';
import { Baby, Coins, Recycle, Search, SlidersHorizontal, Sparkles, Timer, TrendingUp, Users, X } from 'lucide-react-native';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import type { RecipeSearchSuggestion } from '@/utils/recipeSearchLocal';
import type { FastFilter, ToggleableFastFilter } from '@/utils/recipes';

const QUICK_FILTERS: Array<{
  value: FastFilter;
  label: string;
  shortLabel: string;
  icon: typeof Timer;
}> = [
  { value: 'all', label: 'All picks', shortLabel: 'All', icon: Sparkles },
  { value: 'under20', label: 'Under 20 mins', shortLabel: 'Under 20m', icon: Timer },
  { value: 'budget', label: 'Budget friendly', shortLabel: 'Budget', icon: Coins },
  { value: 'smallPortions', label: '1–2 servings', shortLabel: '1–2 serve', icon: Users },
  { value: 'leftover', label: 'Leftover', shortLabel: 'Leftover', icon: Recycle },
  { value: 'kids', label: 'Kids', shortLabel: 'Kids', icon: Baby },
];

type QuickFiltersSectionProps = {
  activeFilters: ToggleableFastFilter[];
  pantryFilterActive: boolean;
  pantryIngredientCount: number;
  hasQuickFilters: boolean;
  showRefineCard?: boolean;
  refineSubtitle?: string;
  activeFilterLabels?: string[];
  onFilterToggle: (filter: FastFilter) => void;
  onClearPantryFilter: () => void;
  variant?: 'default' | 'recipes';
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  searchTestId?: string;
  resultCount?: number;
  totalCount?: number;
  onClearAll?: () => void;
  pantryMatchSortActive?: boolean;
  onPantryMatchSortToggle?: () => void;
  pantryMatchSortTestId?: string;
  searchSuggestions?: RecipeSearchSuggestion[];
  onSuggestionSelect?: (label: string) => void;
  searchLoading?: boolean;
};

export function getQuickFilterLabels(activeFilters: ToggleableFastFilter[]): string[] {
  return QUICK_FILTERS.filter(
    (item) => item.value !== 'all' && activeFilters.includes(item.value as ToggleableFastFilter),
  ).map((item) => item.label);
}

export default function QuickFiltersSection({
  activeFilters,
  pantryFilterActive,
  pantryIngredientCount,
  hasQuickFilters,
  showRefineCard = false,
  refineSubtitle = '',
  activeFilterLabels = [],
  onFilterToggle,
  onClearPantryFilter,
  variant = 'default',
  searchQuery = '',
  onSearchChange,
  searchTestId,
  resultCount,
  totalCount,
  onClearAll,
  pantryMatchSortActive = false,
  onPantryMatchSortToggle,
  pantryMatchSortTestId,
  searchSuggestions = [],
  onSuggestionSelect,
  searchLoading = false,
}: QuickFiltersSectionProps) {
  const { colors: themeColors, isDark } = useTheme();
  const isRecipesVariant = variant === 'recipes';
  const hasSearch = searchQuery.trim().length > 0;
  const showActiveRow = isRecipesVariant && (hasQuickFilters || hasSearch || pantryMatchSortActive);
  const countLabel =
    resultCount !== undefined && totalCount !== undefined
      ? hasSearch
        ? `${resultCount} of ${totalCount}`
        : `${totalCount} dishes`
      : null;

  const showSuggestions =
    isRecipesVariant && hasSearch && searchSuggestions.length > 0 && Boolean(onSuggestionSelect);

  const suggestionKindLabel = (kind: RecipeSearchSuggestion['kind']) => {
    if (kind === 'dish') return 'Dish';
    if (kind === 'ingredient') return 'Ingredient';
    return 'Tag';
  };

  const filterChipScroll = (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterChipScroll}
    >
      {QUICK_FILTERS.map(({ value, label, shortLabel, icon: Icon }) => {
        const isAll = value === 'all';
        const isActive = isAll
          ? activeFilters.length === 0 && !pantryFilterActive
          : activeFilters.includes(value as ToggleableFastFilter);
        const chipLabel = isRecipesVariant ? shortLabel : label;
        return (
          <Pressable
            key={value}
            onPress={() => onFilterToggle(value)}
            style={[
              styles.filterChip,
              isRecipesVariant && styles.filterChipCompact,
              {
                backgroundColor: isActive ? 'rgba(255,107,53,0.12)' : themeColors.cream,
                borderColor: isActive ? colors.primary : themeColors.border,
                borderWidth: isActive ? 1.5 : 1,
              },
            ]}
          >
            <Icon size={13} color={isActive ? colors.primary : themeColors.muted} />
            <Text
              style={[
                styles.filterText,
                { color: isActive ? colors.primary : themeColors.charcoal },
                isActive && styles.filterTextActive,
              ]}
            >
              {chipLabel}
            </Text>
          </Pressable>
        );
      })}
      {isRecipesVariant && onPantryMatchSortToggle && (
        <Pressable
          onPress={() => {
            void Haptics.selectionAsync();
            onPantryMatchSortToggle();
          }}
          testID={pantryMatchSortTestId}
          accessibilityRole="button"
          accessibilityState={{ selected: pantryMatchSortActive }}
          style={[
            styles.filterChip,
            styles.filterChipCompact,
            {
              backgroundColor: pantryMatchSortActive ? 'rgba(0,168,107,0.12)' : themeColors.cream,
              borderColor: pantryMatchSortActive ? colors.green : themeColors.border,
              borderWidth: pantryMatchSortActive ? 1.5 : 1,
            },
          ]}
        >
          <TrendingUp
            size={13}
            color={pantryMatchSortActive ? colors.green : themeColors.muted}
          />
          <Text
            style={[
              styles.filterText,
              { color: pantryMatchSortActive ? colors.green : themeColors.charcoal },
              pantryMatchSortActive && styles.filterTextActive,
            ]}
          >
            Best match
          </Text>
        </Pressable>
      )}
      {isRecipesVariant && pantryFilterActive && (
        <Pressable
          onPress={() => {
            void Haptics.selectionAsync();
            onClearPantryFilter();
          }}
          style={[
            styles.filterChip,
            styles.filterChipCompact,
            styles.pantryChip,
            { borderColor: colors.green },
          ]}
        >
          <Text style={styles.pantryChipText}>Pantry · {pantryIngredientCount}</Text>
          <X size={12} color={colors.green} />
        </Pressable>
      )}
    </ScrollView>
  );

  const filterChipWrap = (
    <View style={styles.filterChipRow}>
      {QUICK_FILTERS.map(({ value, label, icon: Icon }) => {
        const isAll = value === 'all';
        const isActive = isAll
          ? activeFilters.length === 0
          : activeFilters.includes(value as ToggleableFastFilter);
        return (
          <Pressable
            key={value}
            onPress={() => onFilterToggle(value)}
            style={[
              styles.filterChip,
              {
                backgroundColor: isActive ? 'rgba(255,107,53,0.1)' : themeColors.cream,
                borderColor: isActive ? colors.primary : themeColors.border,
                borderWidth: isActive ? 2 : 1,
              },
            ]}
          >
            <Icon size={14} color={isActive ? colors.primary : themeColors.muted} />
            <Text
              style={[
                styles.filterText,
                { color: isActive ? colors.primary : themeColors.charcoal },
                isActive && styles.filterTextActive,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  if (isRecipesVariant) {
    return (
      <View
        style={[
          styles.recipesToolbar,
          { backgroundColor: themeColors.white, borderColor: themeColors.border },
        ]}
      >
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: themeColors.cream,
              borderColor: hasSearch ? colors.primary : themeColors.border,
            },
          ]}
        >
          <Search size={18} color={hasSearch ? colors.primary : themeColors.muted} />
          <TextInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Search by dish or ingredient"
            placeholderTextColor={themeColors.placeholder}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="never"
            style={[styles.searchInput, { color: themeColors.charcoal }]}
            testID={searchTestId}
          />
          {hasSearch && (
            <Pressable
              onPress={() => onSearchChange?.('')}
              hitSlop={8}
              accessibilityLabel="Clear search"
              style={[styles.clearBtn, { backgroundColor: themeColors.border }]}
            >
              <X size={14} color={themeColors.muted} />
            </Pressable>
          )}
          {searchLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : null}
        </View>

        {showSuggestions ? (
          <View
            style={[
              styles.suggestionsBox,
              { backgroundColor: themeColors.cream, borderColor: themeColors.border },
            ]}
          >
            {searchSuggestions.map((suggestion, index) => (
              <Pressable
                key={suggestion.key}
                testID={index === 0 ? 'recipes-search-suggestion-first' : undefined}
                onPress={() => {
                  void Haptics.selectionAsync();
                  onSuggestionSelect?.(suggestion.label);
                }}
                style={({ pressed }) => [
                  styles.suggestionRow,
                  index < searchSuggestions.length - 1 && styles.suggestionRowBorder,
                  { borderBottomColor: themeColors.border },
                  pressed && styles.suggestionRowPressed,
                ]}
              >
                <Search size={14} color={colors.primary} />
                <Text
                  style={[styles.suggestionLabel, { color: themeColors.charcoal }]}
                  numberOfLines={1}
                >
                  {suggestion.label}
                </Text>
                <Text style={[styles.suggestionKind, { color: themeColors.muted }]}>
                  {suggestionKindLabel(suggestion.kind)}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        <View style={styles.filtersHeaderRow}>
          <View style={styles.filtersTitleRow}>
            <SlidersHorizontal size={14} color={colors.primary} />
            <Text style={[styles.filtersLabel, { color: themeColors.charcoal }]}>Quick filters</Text>
          </View>
          {countLabel ? <Text style={styles.countBadge}>{countLabel}</Text> : null}
        </View>

        {filterChipScroll}

        {showActiveRow && onClearAll && (
          <View style={styles.activeRow}>
            <Text style={[styles.activeSummary, { color: themeColors.muted }]} numberOfLines={1}>
              {[
                hasSearch ? `"${searchQuery.trim()}"` : null,
                activeFilterLabels.length > 0 ? activeFilterLabels.join(' · ') : null,
                pantryFilterActive ? 'Pantry mode' : null,
                pantryMatchSortActive ? 'Best pantry match' : null,
              ]
                .filter(Boolean)
                .join(' · ')}
            </Text>
            <Pressable
              onPress={() => {
                void Haptics.selectionAsync();
                onClearAll();
              }}
              hitSlop={8}
            >
              <Text style={styles.clearAllText}>Clear all</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.quickFiltersSection,
        { backgroundColor: themeColors.white, borderColor: themeColors.border },
      ]}
    >
      <View style={styles.quickFiltersHeader}>
        <SlidersHorizontal size={16} color={colors.primary} />
        <Text style={[styles.quickFiltersTitle, { color: themeColors.charcoal }]}>Quick filters</Text>
      </View>

      {showRefineCard && hasQuickFilters && (
        <View
          style={[
            styles.filterRefineCard,
            {
              backgroundColor: isDark ? 'rgba(255,107,53,0.08)' : 'rgba(255,107,53,0.06)',
              borderColor: themeColors.border,
            },
          ]}
        >
          <Text style={[styles.filterRefineTitle, { color: themeColors.charcoal }]}>Refined for you</Text>
          <Text style={[styles.filterRefineSub, { color: themeColors.muted }]}>
            {activeFilterLabels.length > 0 ? `Matching ${activeFilterLabels.join(' · ')}. ` : ''}
            {pantryFilterActive ? 'Pantry mode is on. ' : ''}
            {refineSubtitle}
          </Text>
        </View>
      )}

      {pantryFilterActive && (
        <Pressable
          onPress={() => {
            void Haptics.selectionAsync();
            onClearPantryFilter();
          }}
          style={styles.pantryBanner}
        >
          <Text style={styles.pantryBannerTitle}>Pantry mode · {pantryIngredientCount} items</Text>
          <Text style={[styles.pantryBannerSub, { color: themeColors.muted }]}>
            Tap to show all recipes
          </Text>
        </Pressable>
      )}

      {filterChipWrap}
    </View>
  );
}

const styles = StyleSheet.create({
  recipesToolbar: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.card,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: spacing.xs,
  },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionsBox: {
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  suggestionRowBorder: {
    borderBottomWidth: 1,
  },
  suggestionRowPressed: {
    opacity: 0.85,
  },
  suggestionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  suggestionKind: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  filtersHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  filtersTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filtersLabel: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  countBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  filterChipScroll: {
    gap: 8,
    paddingRight: spacing.sm,
  },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  activeSummary: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  pantryChip: {
    backgroundColor: 'rgba(0,168,107,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pantryChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.green,
  },
  quickFiltersSection: {
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.card,
  },
  quickFiltersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  quickFiltersTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.charcoal,
  },
  filterChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterRefineCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  filterRefineTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  filterRefineSub: {
    fontSize: 13,
    lineHeight: 19,
  },
  pantryBanner: {
    marginBottom: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(0,168,107,0.1)',
    padding: 14,
  },
  pantryBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.green,
  },
  pantryBannerSub: {
    marginTop: 2,
    fontSize: 12,
    color: colors.muted,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterChipCompact: {
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
  },
  filterTextActive: {
    fontWeight: '800',
  },
});
