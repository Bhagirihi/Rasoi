import { StyleSheet, View } from 'react-native';

import AppHeaderSettingsButton from '@/components/AppHeaderSettingsButton';
import { FreeBadge } from '@/components/ui/Primitives';
import { spacing } from '@/constants/theme';

export default function AppHeaderTrailing({
  showSettingsButton = true,
}: {
  showSettingsButton?: boolean;
}) {
  return (
    <View style={styles.row}>
      <FreeBadge />
      {showSettingsButton ? <AppHeaderSettingsButton /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
