import { useNetInfo } from '@react-native-community/netinfo';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { appFonts } from '@/constants/fonts';
import { useRecipes } from '@/context/RecipesContext';

/**
 * Shown when the recipe catalog failed to refresh. Gated on actual
 * connectivity: a 401/500/session-expiry is not "offline" and must not claim
 * to be — it gets its own message.
 */
export default function OfflineBanner() {
  const { error, loading } = useRecipes();
  const netInfo = useNetInfo();

  if (!error || loading) return null;

  const isOffline = netInfo.isConnected === false;
  const text = isOffline
    ? 'Offline — showing your last saved picks. Pull to refresh when back online.'
    : 'Could not refresh recipes — showing your last saved picks. Pull to retry.';

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.text}>{text}</Text>
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
