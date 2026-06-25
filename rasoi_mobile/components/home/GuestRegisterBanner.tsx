import { UserPlus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { colors, radius, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export default function GuestRegisterBanner() {
  const router = useRouter();
  const { colors: themeColors } = useTheme();

  return (
    <Pressable
      onPress={() => router.push('/(auth)/login')}
      style={[styles.card, { backgroundColor: themeColors.white, borderColor: themeColors.border }]}
      accessibilityRole="button"
      accessibilityLabel="Create account to sync pantry and get push picks"
    >
      <View style={styles.iconWrap}>
        <UserPlus size={18} color={colors.green} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: themeColors.charcoal }]}>Save picks across devices</Text>
        <Text style={[styles.body, { color: themeColors.muted }]}>
          Create a free account to sync pantry, saved recipes, and meal notifications.
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,168,107,0.12)',
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
  },
});
