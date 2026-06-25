import { RefreshCw } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

type SyncStatusCardProps = {
  lastSyncedAt: string | null;
  onRefresh: () => void;
};

function formatSyncedLabel(value: string | null): string {
  if (!value) return 'Not synced yet';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Synced recently';
  return `Last synced ${date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })}`;
}

export default function SyncStatusCard({ lastSyncedAt, onRefresh }: SyncStatusCardProps) {
  const { colors: themeColors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: themeColors.white, borderColor: themeColors.border }]}>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: themeColors.charcoal }]}>Kitchen sync</Text>
        <Text style={[styles.body, { color: themeColors.muted }]}>{formatSyncedLabel(lastSyncedAt)}</Text>
      </View>
      <Pressable
        onPress={onRefresh}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel="Refresh synced profile"
      >
        <RefreshCw size={16} color={colors.green} />
        <Text style={styles.buttonText}>Refresh</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
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
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: 'rgba(0,168,107,0.1)',
  },
  buttonText: {
    color: colors.green,
    fontWeight: '700',
    fontSize: 13,
  },
});
