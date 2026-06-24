import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import Text from '@/components/ui/Text';
import { spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

type HomeSectionHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
};

export default function HomeSectionHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor,
}: HomeSectionHeaderProps) {
  const { colorScheme } = useTheme();

  return (
    <View style={styles.wrap}>
      <View style={styles.titleRow}>
        {Icon ? <Icon size={16} color={iconColor} /> : null}
        <Text variant="h3" scheme={colorScheme} style={styles.title}>
          {title}
        </Text>
      </View>
      {subtitle ? (
        <Text variant="body" color="secondary" scheme={colorScheme} style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
  },
});
