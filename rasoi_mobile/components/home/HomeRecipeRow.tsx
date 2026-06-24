import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Leaf } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { appFonts } from '@/constants/fonts';
import { colors, layout, radius, shadows, spacing } from '@/constants/theme';
import type { Recipe } from '@/data/mockRecipes';
import { useTheme } from '@/context/ThemeContext';
import type { AffiliatePartner } from '@/utils/affiliate';
import { getHomeDisplayTags, type HomeRecipeSection } from '@/utils/homeRecipeTags';
import { getRecipeVisualIdentity } from '@/utils/recipeVisualIdentity';

type HomeRecipeRowProps = {
  recipe: Recipe;
  section?: HomeRecipeSection;
  pickLabel?: string;
  fullWidth?: boolean;
  pantryMatchPercent: number;
  cookCtaLabel: string;
  missing: string[];
  onPress: () => void;
  onCookTonight: () => void;
  onShopMissing: (partner?: AffiliatePartner) => void;
};

const PRIMARY_SOFT = '#FFF0EA';
const PREP_PILL_BG = '#F3EDE6';
const DIET_PILL_BG = '#E8F5EE';
const MATCH_PILL_BG = '#FFF4ED';
const ORDER_PARTNERS_LINE = 'Ordering missing items from Blinkit · Zepto · Instamart';
const ACTION_RADIUS = 10;

function ThemeAccentBand({
  children,
  fullWidth,
}: {
  children: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <LinearGradient
      colors={['#FFE8DC', PRIMARY_SOFT]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.themeBand, fullWidth && styles.themeBandFullWidth]}
    >
      <View style={styles.pickAccent} />
      {children}
    </LinearGradient>
  );
}

function missingPreview(missing: string[]): string {
  if (missing.length === 0) return '';
  const head = missing.slice(0, 2).join(', ');
  const tail = missing.length > 2 ? ` +${missing.length - 2}` : '';
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
  pickLabel,
  fullWidth = false,
  pantryMatchPercent,
  cookCtaLabel,
  missing,
  onPress,
  onCookTonight,
  onShopMissing,
}: HomeRecipeRowProps) {
  const { colors: themeColors } = useTheme();
  const hasMissing = missing.length > 0;
  const isFeatured = Boolean(pickLabel);
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
        fullWidth && styles.cardFullWidth,
        isFeatured && styles.cardFeatured,
        {
          backgroundColor: isFeatured ? '#FFFBF8' : themeColors.white,
          borderColor: isFeatured ? 'rgba(255,107,53,0.2)' : themeColors.border,
        },
      ]}
    >
      {pickLabel ? (
        <ThemeAccentBand fullWidth={fullWidth}>
          <Text style={styles.pickLabel}>{pickLabel.toUpperCase()}</Text>
        </ThemeAccentBand>
      ) : null}

      <View style={[styles.cardBody, fullWidth && styles.cardBodyFullWidth]}>
        <Pressable
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
          }}
          style={styles.content}
        >
          <Text style={[styles.title, { color: themeColors.charcoal }]} numberOfLines={2}>
            {recipe.title}
          </Text>

          {recipe.description ? (
            <Text style={[styles.description, { color: themeColors.muted }]} numberOfLines={2}>
              {recipe.description}
            </Text>
          ) : null}

          <MetaTagsRow
            recipe={recipe}
            section={section}
            pantryMatchPercent={pantryMatchPercent}
            matchColor={matchColor}
            themeColors={themeColors}
          />
        </Pressable>

        {hasMissing ? (
          <View style={styles.orderBlock}>
            <ThemeAccentBand fullWidth={false}>
              <Text style={styles.pickLabel} numberOfLines={2}>
                {ORDER_PARTNERS_LINE}
              </Text>
            </ThemeAccentBand>
            <Text style={[styles.missingPreview, { color: themeColors.muted }]} numberOfLines={1}>
              {missingPreview(missing)}
            </Text>
          </View>
        ) : null}

        <View style={styles.actionsSection}>
          <View style={styles.actionRow}>
            {hasMissing ? (
              <Pressable
                onPress={() => {
                  void Haptics.selectionAsync();
                  onShopMissing();
                }}
                style={({ pressed }) => [
                  styles.actionBtn,
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
                styles.cookBtn,
                hasMissing ? styles.cookBtnSplit : styles.cookBtnFull,
                pressed && styles.actionBtnPressed,
              ]}
            >
              <Text style={styles.cookBtnText} numberOfLines={1}>
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
  cardFullWidth: {
    marginHorizontal: -layout.screenPadding,
    borderRadius: 0,
    borderLeftWidth: 4,
    borderRightWidth: 0,
    ...shadows.cardLifted,
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
  themeBandFullWidth: {
    paddingHorizontal: layout.screenPadding,
  },
  pickAccent: {
    width: 3,
    height: 14,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  pickLabel: {
    flex: 1,
    fontFamily: appFonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.8,
    lineHeight: 15,
    color: '#C44A00',
  },
  orderBlock: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  cardBody: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardBodyFullWidth: {
    paddingHorizontal: layout.screenPadding,
  },
  content: {
    gap: spacing.sm,
  },
  title: {
    fontFamily: appFonts.display,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.2,
  },
  description: {
    fontFamily: appFonts.body,
    fontSize: 14,
    lineHeight: 20,
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
  },
  metaPillText: {
    fontFamily: appFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  missingPreview: {
    fontFamily: appFonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    paddingHorizontal: spacing.xs,
  },
  actionsSection: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,107,53,0.14)',
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
});
