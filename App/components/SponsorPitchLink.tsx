import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { Pressable, StyleSheet, Text } from 'react-native';

import { SPONSOR_APPLY_URL } from '@/constants/links';
import { spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export default function SponsorPitchLink() {
  const { colors } = useTheme();

  const openSponsorPage = () => {
    void Haptics.selectionAsync();
    void Linking.openURL(SPONSOR_APPLY_URL);
  };

  return (
    <Pressable
      onPress={openSponsorPage}
      hitSlop={8}
      accessibilityRole="link"
      accessibilityLabel="Want to display your ad here? Open sponsor page"
      style={styles.wrap}
    >
      <Text style={[styles.text, { color: colors.muted }]}>
        Want to display your ad here?{' '}
        <Text style={[styles.link, { color: colors.primary }]}>Learn more →</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.xs,
    alignItems: 'center',
  },
  text: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
  link: {
    fontWeight: '700',
  },
});
