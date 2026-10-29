import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Bookmark, Download, Share2 } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RecipeVisualBadge from "@/components/RecipeVisualBadge";
import { appFonts } from "@/constants/fonts";
import { colors, radius, spacing } from "@/constants/theme";
import type { Recipe } from "@/data/mockRecipes";
import { hasRecipeImage } from "@/utils/recipeImage";
import { getRecipeVisualIdentity } from "@/utils/recipeVisualIdentity";

type RecipeDetailHeroProps = {
  recipe: Recipe;
  saved: boolean;
  offlineDownloaded: boolean;
  onBack: () => void;
  onShare: () => void;
  onSave: () => void;
  onOfflineToggle: () => void;
  saveTestId?: string;
  offlineTestId?: string;
};

export default function RecipeDetailHero({
  recipe,
  saved,
  offlineDownloaded,
  onBack,
  onShare,
  onSave,
  onOfflineToggle,
  saveTestId,
  offlineTestId,
}: RecipeDetailHeroProps) {
  const visual = getRecipeVisualIdentity(recipe);
  const recipeHasPhoto = hasRecipeImage(recipe);

  return (
    <View
      style={[
        styles.hero,
        recipeHasPhoto ? styles.heroWithPhoto : styles.heroFallback,
      ]}
    >
      <RecipeVisualBadge
        recipe={recipe}
        variant="backdrop"
        topScrim={recipeHasPhoto}
        style={StyleSheet.absoluteFillObject}
      />
      <LinearGradient
        colors={
          recipeHasPhoto
            ? ["rgba(0,0,0,0.55)", "transparent", "rgba(0,0,0,0.35)"]
            : ["transparent", "rgba(26,26,46,0.75)"]
        }
        locations={recipeHasPhoto ? [0, 0.5, 1] : undefined}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView edges={["top"]} style={styles.topBar}>
        <Pressable
          onPress={onBack}
          style={styles.iconBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color={colors.white} />
        </Pressable>
        <View style={styles.topActions}>
          <Pressable
            onPress={onShare}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Share recipe"
          >
            <Share2 size={20} color={colors.white} />
          </Pressable>
          <Pressable
            onPress={onOfflineToggle}
            style={[styles.actionBtn, offlineDownloaded && styles.actionBtnActive]}
            testID={offlineTestId}
            accessibilityRole="button"
            accessibilityLabel={
              offlineDownloaded ? "Remove offline download" : "Download for offline"
            }
          >
            <Download
              size={16}
              color={colors.white}
              strokeWidth={2.4}
            />
            <Text style={styles.actionBtnText}>
              {offlineDownloaded ? "Offline" : "Download"}
            </Text>
          </Pressable>
          <Pressable
            onPress={onSave}
            style={[styles.actionBtn, saved && styles.actionBtnActive]}
            testID={saveTestId}
            accessibilityRole="button"
            accessibilityLabel={saved ? "Remove from saved" : "Save recipe"}
          >
            <Bookmark
              size={16}
              color={colors.white}
              fill={saved ? colors.white : "transparent"}
            />
            <Text style={styles.actionBtnText}>{saved ? "Saved" : "Save"}</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      {!recipeHasPhoto ? (
        <View style={styles.fallbackLabel}>
          <Text style={styles.fallbackEmoji}>{visual.emoji}</Text>
          <Text style={styles.fallbackKitchen}>{visual.kitchenLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    position: "relative",
    overflow: "hidden",
  },
  heroWithPhoto: {
    height: 300,
  },
  heroFallback: {
    height: 220,
  },
  topBar: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.38)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: radius.pill,
    backgroundColor: "rgba(0,0,0,0.38)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 9,
  },
  actionBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionBtnText: {
    fontFamily: appFonts.bodyBold,
    fontSize: 12,
    color: colors.white,
  },
  fallbackLabel: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  fallbackEmoji: {
    fontSize: 48,
  },
  fallbackKitchen: {
    fontFamily: appFonts.bodyBold,
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
});
