import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { appFonts } from '@/constants/fonts';
import { colors, radius, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

type HomeBrowseLinkProps = {
  count: number;
  onPress: () => void;
};

export default function HomeBrowseLink({ count, onPress }: HomeBrowseLinkProps) {
  const { colors: themeColors } = useTheme();

  if (count <= 0) return null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: themeColors.white,
          borderColor: themeColors.border,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
    >
      <View style={styles.copy}>
        <Text style={[styles.title, { color: themeColors.charcoal }]}>Browse more dishes</Text>
        <Text style={[styles.sub, { color: themeColors.muted }]}>
          {count} more {count === 1 ? 'recipe' : 'recipes'} on the Recipe tab
        </Text>
      </View>
      <ChevronRight size={20} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  copy: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    fontFamily: appFonts.bodyBold,
    fontSize: 15,
  },
  sub: {
    marginTop: 2,
    fontFamily: appFonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
});
