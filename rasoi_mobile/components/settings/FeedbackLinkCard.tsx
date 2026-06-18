import * as Haptics from 'expo-haptics';
import { MessageSquarePlus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CONTACT_EMAIL } from '@/constants/links';
import { SettingsCard } from '@/components/settings/SettingsBlocks';
import { colors, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

type FeedbackLinkCardProps = {
  onPress: () => void;
};

export default function FeedbackLinkCard({ onPress }: FeedbackLinkCardProps) {
  const { colors: themeColors } = useTheme();

  return (
    <SettingsCard style={styles.card}>
      <Pressable
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={styles.row}
      >
        <View style={styles.iconWrap}>
          <MessageSquarePlus size={20} color={colors.primary} />
        </View>
        <View style={styles.copy}>
          <Text style={[styles.title, { color: themeColors.charcoal }]}>Send feedback</Text>
          <Text style={[styles.body, { color: themeColors.muted }]}>
            Report a bug, share an idea, or email {CONTACT_EMAIL}.
          </Text>
        </View>
        <Text style={[styles.cta, { color: colors.primary }]}>Open →</Text>
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
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,107,53,0.12)',
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
    marginTop: 2,
    fontSize: 13,
    lineHeight: 20,
  },
  cta: {
    fontSize: 13,
    fontWeight: '800',
  },
});
