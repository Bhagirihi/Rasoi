import * as Haptics from 'expo-haptics';
import { Check, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getPantrySectionIcon } from '@/components/pantry/pantrySectionMeta';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import type { PantrySection } from '@/services/reference';
import { useTheme } from '@/context/ThemeContext';
import { pantryHasIngredient } from '@/utils/pantryCanonical';

function countStockedInSection(items: string[], pantryIngredients: string[]) {
  return items.filter((item) => pantryHasIngredient(pantryIngredients, item)).length;
}

type PantrySectionCardProps = {
  section: PantrySection;
  pantryIngredients: string[];
  onToggle: (item: string) => void;
  onAddAll?: (items: string[]) => void;
  accent?: boolean;
  subtitle?: string;
  defaultCollapsed?: boolean;
  collapsible?: boolean;
  /** First-time setup: highlight unselected chips */
  setupMode?: boolean;
  /** Nested inside a grouped panel — no outer card chrome */
  embedded?: boolean;
  /** Hairline above embedded subsection */
  showDivider?: boolean;
  /** Tighter grid and padding */
  dense?: boolean;
};

export function PantrySectionCard({
  section,
  pantryIngredients,
  onToggle,
  onAddAll,
  accent = false,
  subtitle,
  defaultCollapsed = false,
  collapsible = false,
  setupMode = false,
  embedded = false,
  showDivider = false,
  dense = false,
}: PantrySectionCardProps) {
  const { colors: themeColors, isDark } = useTheme();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const stockedInSection = countStockedInSection(section.items, pantryIngredients);
  const sectionComplete = section.items.length > 0 && stockedInSection === section.items.length;
  const missingItems = section.items.filter((item) => !pantryHasIngredient(pantryIngredients, item));
  const SectionIcon = getPantrySectionIcon(section.title);
  const useDense = dense || embedded;
  const columns = setupMode ? 2 : 3;

  const handleAddAll = () => {
    if (!onAddAll || missingItems.length === 0) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddAll(missingItems);
  };

  const toggleCollapsed = () => {
    if (!collapsible) return;
    void Haptics.selectionAsync();
    setCollapsed((value) => !value);
  };

  const chipBasis = columns === 3 ? '31%' : '47%';
  const chipMaxWidth = columns === 3 ? '32%' : '48%';

  return (
    <View
      style={[
        !embedded && styles.card,
        !embedded && accent && styles.cardAccent,
        !embedded && { backgroundColor: themeColors.white, borderColor: accent ? 'rgba(255,107,53,0.3)' : themeColors.border },
        embedded && showDivider && [styles.embeddedDivider, { borderTopColor: themeColors.border }],
      ]}
    >
      <Pressable
        onPress={collapsible ? toggleCollapsed : undefined}
        disabled={!collapsible}
        style={({ pressed }) => [
          styles.header,
          useDense && styles.headerDense,
          embedded && styles.headerEmbedded,
          collapsible && pressed && styles.headerPressed,
        ]}
      >
        <View
          style={[
            styles.iconWrap,
            useDense && styles.iconWrapDense,
            {
              backgroundColor: accent
                ? isDark
                  ? 'rgba(255,107,53,0.18)'
                  : 'rgba(255,107,53,0.1)'
                : isDark
                  ? 'rgba(107,114,128,0.14)'
                  : 'rgba(107,114,128,0.08)',
            },
          ]}
        >
          <SectionIcon
            size={useDense ? 14 : 16}
            color={accent ? colors.primary : themeColors.muted}
            strokeWidth={2.5}
          />
        </View>

        <View style={styles.titleBlock}>
          <View style={styles.titleRow}>
            <Text
              style={[styles.title, useDense && styles.titleDense, { color: themeColors.charcoal }]}
              numberOfLines={1}
            >
              {section.title}
            </Text>
            {sectionComplete ? (
              <View style={styles.completeBadge}>
                <Check size={10} color={colors.green} strokeWidth={3} />
              </View>
            ) : null}
          </View>
          {subtitle && !useDense ? (
            <Text style={[styles.subtitle, { color: themeColors.muted }]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={styles.headerActions}>
          <View
            style={[
              styles.countBadge,
              useDense && styles.countBadgeDense,
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
                styles.countText,
                useDense && styles.countTextDense,
                { color: sectionComplete ? colors.green : themeColors.muted },
              ]}
            >
              {stockedInSection}/{section.items.length}
            </Text>
          </View>
          {collapsible ? (
            collapsed ? (
              <ChevronDown size={16} color={themeColors.muted} />
            ) : (
              <ChevronUp size={16} color={themeColors.muted} />
            )
          ) : null}
        </View>
      </Pressable>

      {!collapsed ? (
        <>
          {onAddAll && !setupMode && missingItems.length > 0 ? (
            <Pressable
              onPress={handleAddAll}
              hitSlop={6}
              style={[styles.addAllRow, useDense && styles.addAllRowDense]}
            >
              <Text style={[styles.addAllText, { color: colors.primary }]}>
                +{missingItems.length} all
              </Text>
            </Pressable>
          ) : null}

          <View style={[styles.grid, useDense && styles.gridDense, embedded && styles.gridEmbedded]}>
            {section.items.map((item) => {
              const isSelected = pantryHasIngredient(pantryIngredients, item);
              return (
                <Pressable
                  key={item}
                  onPress={() => onToggle(item)}
                  style={({ pressed }) => [
                    styles.chip,
                    useDense && styles.chipDense,
                    {
                      flexBasis: chipBasis,
                      maxWidth: chipMaxWidth,
                      backgroundColor: isSelected
                        ? isDark
                          ? 'rgba(0,168,107,0.16)'
                          : 'rgba(0,168,107,0.08)'
                        : themeColors.cream,
                      borderColor: isSelected
                        ? colors.green
                        : setupMode && !isSelected
                          ? 'rgba(255,107,53,0.35)'
                          : themeColors.border,
                      opacity: pressed ? 0.82 : 1,
                    },
                  ]}
                >
                  {isSelected ? (
                    <View style={[styles.chipCheck, useDense && styles.chipCheckDense]}>
                      <Check size={useDense ? 8 : 10} color={colors.white} strokeWidth={3} />
                    </View>
                  ) : setupMode ? (
                    <View style={[styles.chipNewDot, { borderColor: colors.primary }]} />
                  ) : (
                    <View style={[styles.chipDot, useDense && styles.chipDotDense, { borderColor: themeColors.border }]} />
                  )}
                  <Text
                    style={[
                      styles.chipText,
                      useDense && styles.chipTextDense,
                      { color: isSelected ? colors.green : themeColors.charcoal },
                    ]}
                    numberOfLines={2}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.card,
  },
  cardAccent: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  embeddedDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerDense: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm + 2,
    paddingBottom: spacing.xs,
  },
  headerEmbedded: {
    paddingTop: spacing.sm,
  },
  headerPressed: {
    opacity: 0.9,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapDense: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    flexShrink: 1,
  },
  titleDense: {
    fontSize: 13,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  completeBadge: {
    width: 16,
    height: 16,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,168,107,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  countBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  countBadgeDense: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  countText: {
    fontSize: 11,
    fontWeight: '800',
  },
  countTextDense: {
    fontSize: 10,
  },
  addAllRow: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
  },
  addAllRowDense: {
    paddingHorizontal: spacing.md,
    paddingBottom: 2,
  },
  addAllText: {
    fontSize: 11,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  gridDense: {
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm + 2,
  },
  gridEmbedded: {
    paddingBottom: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    flexGrow: 1,
    minHeight: 44,
  },
  chipDense: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: spacing.xs + 2,
    minHeight: 34,
    borderWidth: 1,
    gap: 4,
  },
  chipCheck: {
    width: 16,
    height: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  chipCheckDense: {
    width: 14,
    height: 14,
  },
  chipDot: {
    width: 16,
    height: 16,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
    flexShrink: 0,
  },
  chipDotDense: {
    width: 12,
    height: 12,
    borderWidth: 1,
  },
  chipNewDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    borderWidth: 2,
    backgroundColor: 'transparent',
    flexShrink: 0,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
    lineHeight: 15,
  },
  chipTextDense: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '600',
  },
});
