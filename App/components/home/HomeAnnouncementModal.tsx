import { Megaphone, X } from 'lucide-react-native';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SmoothModal from '@/components/ui/SmoothModal';
import { colors, radius, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import type { HomeAnnouncement } from '@/utils/announcements';

type HomeAnnouncementModalProps = {
  visible: boolean;
  announcement: HomeAnnouncement;
  onDismiss: () => void;
  onCta?: () => void;
};

export default function HomeAnnouncementModal({
  visible,
  announcement,
  onDismiss,
  onCta,
}: HomeAnnouncementModalProps) {
  const insets = useSafeAreaInsets();
  const { colors: themeColors } = useTheme();
  const showCta = Boolean(announcement.ctaLabel && announcement.ctaLink);

  return (
    <SmoothModal visible={visible} onClose={onDismiss} variant="center" dismissOnBackdrop>
      <View
        style={[
          styles.card,
          {
            backgroundColor: themeColors.white,
            borderColor: themeColors.border,
            marginTop: insets.top,
            marginBottom: insets.bottom,
          },
        ]}
      >
        <Pressable
          onPress={onDismiss}
          style={styles.closeButton}
          accessibilityRole="button"
          accessibilityLabel="Dismiss announcement"
        >
          <X size={20} color={themeColors.muted} />
        </Pressable>

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {announcement.imageUrl ? (
            <Image
              source={{ uri: announcement.imageUrl }}
              style={styles.heroImage}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
            />
          ) : (
            <View style={[styles.iconHero, { backgroundColor: 'rgba(0,168,107,0.12)' }]}>
              <Megaphone size={28} color={colors.green} />
            </View>
          )}

          <Text style={[styles.title, { color: themeColors.charcoal }]}>{announcement.title}</Text>
          <Text style={[styles.body, { color: themeColors.muted }]}>{announcement.body}</Text>

          {showCta ? (
            <Pressable
              onPress={onCta}
              style={styles.ctaButton}
              accessibilityRole="button"
              accessibilityLabel={announcement.ctaLabel ?? 'Open'}
            >
              <Text style={styles.ctaLabel}>{announcement.ctaLabel}</Text>
            </Pressable>
          ) : null}

          <Pressable onPress={onDismiss} style={styles.secondaryDismiss}>
            <Text style={[styles.secondaryDismissText, { color: themeColors.muted }]}>Not now</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SmoothModal>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '88%',
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  heroImage: {
    width: '100%',
    height: 160,
    borderRadius: radius.lg,
  },
  iconHero: {
    width: '100%',
    height: 120,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  ctaButton: {
    marginTop: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.green,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  ctaLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryDismiss: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  secondaryDismissText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
