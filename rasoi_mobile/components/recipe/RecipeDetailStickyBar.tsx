import * as Haptics from "expo-haptics";
import { ShoppingCart, UtensilsCrossed } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { appFonts } from "@/constants/fonts";
import { colors, layout, radius, shadows, spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import type { AffiliatePartner } from "@/utils/affiliate";

type ShoppingProgress = {
  shopped: number;
  total: number;
};

type RecipeDetailStickyBarProps = {
  showPartners: boolean;
  missingCount: number;
  nextShopItem: string | null;
  shoppingProgress: ShoppingProgress | null;
  onDeliveryPress: () => void;
  onShopAll: () => void;
  onShopNext: (partner: AffiliatePartner, item: string) => void;
  onPaywallPress: () => void;
  onLayout: (height: number) => void;
};

export default function RecipeDetailStickyBar({
  showPartners,
  missingCount,
  nextShopItem,
  shoppingProgress,
  onDeliveryPress,
  onShopAll,
  onShopNext,
  onPaywallPress,
  onLayout,
}: RecipeDetailStickyBarProps) {
  const { colors: themeColors } = useTheme();

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={[styles.bar, { backgroundColor: themeColors.white, borderTopColor: themeColors.border }]}
      onLayout={(event) => {
        const height = event.nativeEvent.layout.height;
        if (height > 0) onLayout(height);
      }}
    >
      {showPartners ? (
        <>
          <Pressable
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onDeliveryPress();
            }}
            style={styles.deliveryBtn}
          >
            <View style={styles.deliveryIcon}>
              <UtensilsCrossed size={18} color={colors.white} />
            </View>
            <View style={styles.deliveryCopy}>
              <Text style={styles.deliveryEyebrow}>Skip cooking</Text>
              <Text style={styles.deliveryTitle}>Order on Zomato or Swiggy</Text>
              <Text style={styles.deliverySub}>Ready in ~30 min</Text>
            </View>
          </Pressable>

          {missingCount > 0 && nextShopItem ? (
            <Pressable
              onPress={() => {
                void Haptics.selectionAsync();
                onShopNext("blinkit", nextShopItem);
              }}
              style={styles.shopNextBtn}
            >
              <View style={styles.shopNextIcon}>
                <ShoppingCart size={18} color={colors.white} />
              </View>
              <View style={styles.shopNextCopy}>
                <Text style={styles.shopNextTitle}>Shop next: {nextShopItem}</Text>
                <Text style={styles.shopNextSub}>
                  {shoppingProgress
                    ? `${shoppingProgress.shopped} of ${shoppingProgress.total} done`
                    : "Continue your checklist"}
                </Text>
              </View>
            </Pressable>
          ) : missingCount > 0 ? (
            <Pressable
              onPress={() => {
                void Haptics.selectionAsync();
                onShopAll();
              }}
              style={[styles.groceryLink, { borderColor: themeColors.border }]}
            >
              <ShoppingCart size={15} color={colors.primary} />
              <Text style={styles.groceryLinkText}>
                Shop {missingCount} missing item{missingCount !== 1 ? "s" : ""}
              </Text>
            </Pressable>
          ) : null}
        </>
      ) : (
        <Pressable onPress={onPaywallPress} style={styles.deliveryBtn}>
          <View style={styles.deliveryIcon}>
            <UtensilsCrossed size={18} color={colors.white} />
          </View>
          <View style={styles.deliveryCopy}>
            <Text style={styles.deliveryEyebrow}>Rasoi Plus</Text>
            <Text style={styles.deliveryTitle}>Unlock shop & delivery</Text>
            <Text style={styles.deliverySub}>Start trial in Settings</Text>
          </View>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    ...shadows.card,
  },
  deliveryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.charcoal,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1.5,
    borderColor: "#E23744",
  },
  deliveryIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  deliveryCopy: {
    flex: 1,
    gap: 1,
  },
  deliveryEyebrow: {
    fontFamily: appFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: colors.saffron,
  },
  deliveryTitle: {
    fontFamily: appFonts.bodyBold,
    fontSize: 15,
    lineHeight: 19,
    color: colors.white,
  },
  deliverySub: {
    fontFamily: appFonts.body,
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
  },
  shopNextBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    ...shadows.cta,
  },
  shopNextIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  shopNextCopy: {
    flex: 1,
    gap: 2,
  },
  shopNextTitle: {
    fontFamily: appFonts.bodyBold,
    fontSize: 14,
    color: colors.white,
  },
  shopNextSub: {
    fontFamily: appFonts.body,
    fontSize: 11,
    color: "rgba(255,255,255,0.88)",
  },
  groceryLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  groceryLinkText: {
    fontFamily: appFonts.bodyBold,
    fontSize: 13,
    color: colors.primary,
  },
});
