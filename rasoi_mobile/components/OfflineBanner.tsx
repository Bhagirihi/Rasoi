import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { appFonts } from '@/constants/fonts';
import { useRecipes } from '@/context/RecipesContext';

/** Shown when the recipe catalog failed to refresh (likely offline). */
export default function OfflineBanner() {
  const { error, loading } = useRecipes();
  const showOffline = Boolean(error) && !loading;

  if (!showOffline) return null;

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.text}>Offline — showing your last saved picks. Pull to refresh when back online.</Text>
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
