import { Megaphone, X } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import type { HomeAnnouncement } from '@/utils/announcements';

type HomeAnnouncementBannerProps = {
  announcement: HomeAnnouncement;
  onDismiss: () => void;
  onCta?: () => void;
};

export default function HomeAnnouncementBanner({
  announcement,
  onDismiss,
  onCta,
}: HomeAnnouncementBannerProps) {
  const { colors: themeColors } = useTheme();
  const showCta = Boolean(announcement.ctaLabel && announcement.ctaLink);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: themeColors.white, borderColor: themeColors.border },
      ]}
    >
      <View style={styles.iconWrap}>
        <Megaphone size={18} color={colors.green} />
      </View>

      <Pressable
        style={styles.copy}
        onPress={showCta ? onCta : undefined}
        disabled={!showCta}
        accessibilityRole={showCta ? 'button' : 'text'}
      >
        <Text style={[styles.title, { color: themeColors.charcoal }]}>{announcement.title}</Text>
        <Text style={[styles.body, { color: themeColors.muted }]} numberOfLines={2}>
          {announcement.body}
        </Text>
        {showCta ? (
          <Text style={styles.cta}>{announcement.ctaLabel}</Text>
        ) : null}
      </Pressable>

      <Pressable
        onPress={onDismiss}
        style={styles.dismiss}
        accessibilityRole="button"
        accessibilityLabel="Dismiss announcement"
        hitSlop={8}
      >
        <X size={18} color={themeColors.muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  cta: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '700',
    color: colors.green,
  },
  dismiss: {
    padding: 2,
  },
});
