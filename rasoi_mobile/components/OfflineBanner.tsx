import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { appFonts } from '@/constants/fonts';
import { useAppContext } from '@/context/AppContext';
import { useNetworkConnectivity } from '@/context/NetworkConnectivityContext';
import { useRecipes } from '@/context/RecipesContext';

/** Shown when NetInfo reports offline, QA force is on, or catalog refresh failed. */
export default function OfflineBanner() {
  const { error, loading } = useRecipes();
  const { offlineRecipeIds, planLimits } = useAppContext();
  const { isOffline } = useNetworkConnectivity();
  const showOffline = isOffline || (Boolean(error) && !loading);

  if (!showOffline) return null;

  const showingOfflineRecipes =
    planLimits.offlineRecipeLimit > 0 && offlineRecipeIds.length > 0;

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.text}>
        {showingOfflineRecipes
          ? "No internet — showing your offline recipes so you can keep cooking. Pull to refresh when you're back online."
          : "No internet — pull to refresh when you're back online."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFF4E5',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8C99A',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: {
    fontFamily: appFonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.charcoal,
    textAlign: 'center',
  },
});
