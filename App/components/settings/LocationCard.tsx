import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { SettingsCard } from '@/components/settings/SettingsBlocks';
import { colors, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useRefreshUserLocation } from '@/hooks/useSyncUserLocation';
import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
import { formatUserLocation, isLocationPermissionGranted } from '@/utils/location';

export default function LocationCard() {
  const router = useRouter();
  const { colors: themeColors } = useTheme();
  const { userCity, userState, isLoggedIn } = useAppContext();
  const refreshLocation = useRefreshUserLocation();
  const { showDialog } = useAppDialog();
  const [loading, setLoading] = useState(false);

  const label = formatUserLocation(userCity, userState);

  const handleRefresh = async () => {
    if (!isLoggedIn) {
      showDialog({
        title: 'Session required',
        message: 'Sign in to save your city.',
        buttons: [{ text: 'OK' }],
      });
      return;
    }

    setLoading(true);
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const granted = await isLocationPermissionGranted();
      if (!granted) {
        router.push('/(auth)/onboarding?permissionsOnly=1&step=location');
        return;
      }
      const result = await refreshLocation();
      if (!result.ok) {
        showDialog({
          title: 'Location unavailable',
          message:
            result.reason === 'permission_denied'
              ? 'Allow location access in Settings to show your city for local recipes and sponsors.'
              : result.reason === 'sync_failed'
                ? 'Could not save your city. Check your internet connection and try again.'
                : 'Could not detect your location. Try again outdoors or check GPS.',
          buttons: [{ text: 'OK' }],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsCard style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: 'rgba(255,107,53,0.12)' }]}>
          <MapPin size={18} color={colors.primary} />
        </View>
        <View style={styles.copy}>
          <Text style={[styles.title, { color: themeColors.charcoal }]}>Your location</Text>
          <Text style={[styles.body, { color: themeColors.muted }]}>
            {label}
          </Text>
          <Text style={[styles.hint, { color: themeColors.muted }]}>
            Used for local sponsor reports and city-focused offers.
          </Text>
        </View>
      </View>
      <Pressable
        onPress={() => void handleRefresh()}
        disabled={loading}
        style={[styles.button, { borderColor: themeColors.border }]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Text style={styles.buttonText}>{userCity ? 'Update location' : 'Detect my city'}</Text>
        )}
      </Pressable>
    </SettingsCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  body: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  hint: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
  },
  button: {
    marginTop: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
