import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Info, Leaf, Bookmark } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { appFonts } from '@/constants/fonts';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import type { Recipe } from '@/data/mockRecipes';
import { useTheme } from '@/context/ThemeContext';
import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
import type { AffiliatePartner } from '@/utils/affiliate';
import { getHomeDisplayTags, type HomeRecipeSection } from '@/utils/homeRecipeTags';
import { getRecipeVisualIdentity } from '@/utils/recipeVisualIdentity';
import { partitionIngredients } from '@/utils/recipes';

type HomeRecipeRowProps = {
  recipe: Recipe;
  section?: HomeRecipeSection;
  pantryMatchPercent: number;
  cookCtaLabel: string;
  onPress: () => void;
  onCookTonight: () => void;
  onShopMissing: (missing: string[], partner?: AffiliatePartner) => void;
  /** Hide Blinkit/Zepto strip + Order missing button only (still shows missing list when set). */
  hideMissingOrder?: boolean;
};

const PRIMARY_SOFT = '#FFF0EA';
const PREP_PILL_BG = '#F3EDE6';
const DIET_PILL_BG = '#E8F5EE';
const MATCH_PILL_BG = '#FFF4ED';
const ORDER_PARTNERS_LINE_COMPACT = 'Missing items · Blinkit · Zepto · Instamart';
const ACTION_RADIUS = 10;

function ThemeAccentBand({
  children,
  compact = false,
}: {
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <LinearGradient
      colors={['#FFE8DC', PRIMARY_SOFT]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.themeBand, compact && styles.themeBandCompact]}
    >
      {!compact ? <View style={styles.pickAccent} /> : null}
      {children}
    </LinearGradient>
  );
}

function missingPreview(missing: string[], maxItems = 2): string {
  if (missing.length === 0) return '';
  const head = missing.slice(0, maxItems).join(', ');
  const tail = missing.length > maxItems ? ` +${missing.length - maxItems}` : '';
  return `${head}${tail}`;
}

function MetaPill({
  label,
  backgroundColor,
  textColor,
  icon,
}: {
  label: string;
  backgroundColor: string;
  textColor: string;
  icon?: ReactNode;
}) {
  return (
    <View style={[styles.metaPill, { backgroundColor }]}>
      {icon}
      <Text style={[styles.metaPillText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

function MetaTagsRow({
  recipe,
  section,
  pantryMatchPercent,
  matchColor,
  themeColors,
}: {
  recipe: Recipe;
  section: HomeRecipeSection;
  pantryMatchPercent: number;
  matchColor: string;
  themeColors: { charcoal: string; muted: string };
}) {
  const tags = getHomeDisplayTags(recipe, section);
  const visual = getRecipeVisualIdentity(recipe);
  const styleTag = tags[0];

  return (
    <View style={styles.metaRow}>
      <MetaPill
        label={`${recipe.prepTime} min`}
        backgroundColor={PREP_PILL_BG}
        textColor={themeColors.charcoal}
      />
      <MetaPill
        label={recipe.dietType}
        backgroundColor={DIET_PILL_BG}
        textColor={colors.green}
        icon={<Leaf size={11} color={colors.green} strokeWidth={2.5} />}
      />
      <MetaPill
        label={`${pantryMatchPercent}% match`}
        backgroundColor={MATCH_PILL_BG}
        textColor={matchColor}
      />
      {styleTag ? (
        <View style={[styles.stylePill, { borderColor: `${visual.accent}55` }]}>
          <Text style={[styles.stylePillText, { color: visual.accent }]}>{styleTag}</Text>
        </View>
      ) : null}
    </View>
  );
}

export default function HomeRecipeRow({
  recipe,
  section = 'also',
  pantryMatchPercent,
  cookCtaLabel,
  onPress,
  onCookTonight,
  onShopMissing,
  hideMissingOrder = false,
}: HomeRecipeRowProps) {
  const { colors: themeColors } = useTheme();
  const { isRecipeSaved, toggleSavedRecipe, pantryIngredients } = useAppContext();
  const { showDialog } = useAppDialog();
  const hasDescription = Boolean(recipe.description?.trim());
  const missing = useMemo(
    () => partitionIngredients(recipe, pantryIngredients).missing,
    [recipe.id, recipe.ingredients, pantryIngredients],
  );
  const hasMissing = missing.length > 0;
  const showOrderUi = hasMissing && !hideMissingOrder;
  const isFeatured = section === 'pick';
  const isAlso = section === 'also';
  const saved = isRecipeSaved(recipe.id);
  const matchColor =
    pantryMatchPercent >= 70
      ? colors.green
      : pantryMatchPercent >= 40
        ? colors.primary
        : themeColors.muted;

  return (
    <View
      style={[
        styles.card,
        isFeatured && styles.cardFeatured,
        {
          backgroundColor: isFeatured ? '#FFFBF8' : themeColors.white,
          borderColor: isFeatured ? 'rgba(255,107,53,0.2)' : themeColors.border,
        },
      ]}
    >
      <View style={[styles.cardBody, isAlso && styles.cardBodyAlso, isFeatured && styles.cardBodyFeatured]}>
        <Pressable
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
          }}
          style={({ pressed }) => [styles.content, pressed && styles.contentPressed]}
        >
          <View style={styles.titleRow}>
            <Text
              style={[
                isAlso ? styles.titleAlso : styles.title,
                styles.titleFlex,
                { color: themeColors.charcoal },
              ]}
              numberOfLines={2}
            >
              {recipe.title}
            </Text>
            {hasDescription ? (
              <Pressable
                onPress={(event) => {
                  event.stopPropagation?.();
                  void Haptics.selectionAsync();
                  showDialog({
                    title: recipe.title,
                    message: recipe.description,
                  });
                }}
                hitSlop={10}
                style={styles.infoBtn}
                accessibilityLabel="Recipe description"
                accessibilityRole="button"
              >
                <Info size={18} color={themeColors.muted} strokeWidth={2.25} />
              </Pressable>
            ) : null}
            <Pressable
              onPress={(event) => {
                event.stopPropagation?.();
                void Haptics.selectionAsync();
                toggleSavedRecipe(recipe.id);
              }}
              hitSlop={10}
              style={styles.bookmarkBtn}
              accessibilityLabel={saved ? 'Remove from saved' : 'Save recipe'}
              accessibilityRole="button"
            >
              <Bookmark
                size={20}
                color={saved ? colors.primary : themeColors.muted}
                fill={saved ? colors.primary : 'transparent'}
              />
            </Pressable>
          </View>

          <MetaTagsRow
            recipe={recipe}
            section={section}
            pantryMatchPercent={pantryMatchPercent}
            matchColor={matchColor}
            themeColors={themeColors}
          />
        </Pressable>

        {showOrderUi ? (
          <View style={[styles.orderBlock, isFeatured && styles.orderBlockFeatured]}>
            <ThemeAccentBand compact={isFeatured}>
              {isFeatured ? (
                <View style={styles.orderBandStack}>
                  <Text style={styles.bandLabelCompact} numberOfLines={1}>
                    {ORDER_PARTNERS_LINE_COMPACT}
                  </Text>
                  <Text
                    style={[styles.missingInline, { color: themeColors.muted }]}
                    numberOfLines={1}
                  >
                    Missing: {missingPreview(missing, 4)}
                  </Text>
                </View>
              ) : (
                <Text style={styles.bandLabel} numberOfLines={1}>
                  {ORDER_PARTNERS_LINE_COMPACT}
                </Text>
              )}
            </ThemeAccentBand>
            {!isFeatured ? (
              <Text
                style={[styles.missingPreview, { color: themeColors.muted }]}
                numberOfLines={1}
              >
                {missingPreview(missing)}
              </Text>
            ) : null}
          </View>
        ) : null}

        <View
          style={[
            styles.actionsSection,
            isAlso && styles.actionsSectionAlso,
            isFeatured && styles.actionsSectionFeatured,
          ]}
        >
          <View style={styles.actionRow}>
            {showOrderUi ? (
              <Pressable
                onPress={() => {
                  void Haptics.selectionAsync();
                  onShopMissing(missing);
                }}
                style={({ pressed }) => [
                  styles.actionBtn,
                  isAlso && styles.actionBtnAlso,
                  isFeatured && styles.actionBtnFeatured,
                  styles.orderBtn,
                  pressed && styles.actionBtnPressed,
                ]}
              >
                <Text style={styles.orderBtnText} numberOfLines={1}>
                  Order missing
                </Text>
                <ChevronRight size={14} color={colors.primary} strokeWidth={2.5} />
              </Pressable>
            ) : null}

            <Pressable
              onPress={() => {
                void Haptics.selectionAsync();
                onCookTonight();
              }}
              style={({ pressed }) => [
                styles.actionBtn,
                isAlso && styles.actionBtnAlso,
                isFeatured && styles.actionBtnFeatured,
                styles.cookBtn,
                showOrderUi ? styles.cookBtnSplit : styles.cookBtnFull,
                pressed && styles.actionBtnPressed,
              ]}
            >
              <Text
                style={[styles.cookBtnText, isAlso && styles.cookBtnTextAlso]}
                numberOfLines={1}
              >
                {cookCtaLabel}
              </Text>
              <ChevronRight size={14} color={colors.white} strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>
      </View>
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
  cardFeatured: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  themeBand: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,107,53,0.16)',
  },
  themeBandCompact: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    gap: 0,
    borderBottomWidth: 0,
  },
  orderBandStack: {
    flex: 1,
    gap: 2,
  },
  pickAccent: {
    width: 3,
    height: 14,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  bandLabel: {
    flex: 1,
    fontFamily: appFonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.8,
    lineHeight: 15,
    color: '#C44A00',
  },
  bandLabelCompact: {
    fontFamily: appFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 0.4,
    lineHeight: 13,
    color: '#C44A00',
  },
  missingInline: {
    fontFamily: appFonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
  },
  orderBlock: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  orderBlockFeatured: {
    gap: 0,
    marginTop: 4,
  },
  cardBody: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardBodyFeatured: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardBodyAlso: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  content: {
    gap: spacing.xs,
  },
  contentPressed: {
    opacity: 0.92,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  titleFlex: {
    flex: 1,
  },
  infoBtn: {
    marginTop: 3,
    padding: 2,
  },
  bookmarkBtn: {
    marginTop: 2,
    padding: 2,
  },
  title: {
    fontFamily: appFonts.display,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  titleAlso: {
    fontFamily: appFonts.display,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.15,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  stylePill: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  stylePillText: {
    fontFamily: appFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 0.2,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    flexShrink: 1,
  },
  metaPillText: {
    fontFamily: appFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  missingPreview: {
    fontFamily: appFonts.bodyMedium,
    fontSize: 12,
    lineHeight: 17,
    paddingHorizontal: spacing.xs,
  },
  actionsSection: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,107,53,0.14)',
  },
  actionsSectionFeatured: {
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
  },
  actionsSectionAlso: {
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.sm,
  },
  actionBtn: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: ACTION_RADIUS,
  },
  actionBtnAlso: {
    minHeight: 38,
    paddingVertical: spacing.xs + 2,
  },
  actionBtnFeatured: {
    minHeight: 36,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  actionBtnPressed: {
    opacity: 0.88,
  },
  orderBtn: {
    flex: 0.42,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  orderBtnText: {
    fontFamily: appFonts.bodyBold,
    fontSize: 11,
    color: colors.primary,
  },
  cookBtn: {
    backgroundColor: colors.primary,
    ...shadows.cta,
  },
  cookBtnSplit: {
    flex: 0.58,
  },
  cookBtnFull: {
    flex: 1,
  },
  cookBtnText: {
    fontFamily: appFonts.bodyBold,
    fontSize: 12,
    color: colors.white,
  },
  cookBtnTextAlso: {
    fontSize: 11,
  },
});
