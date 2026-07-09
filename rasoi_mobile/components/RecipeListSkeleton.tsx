import { StyleSheet, View } from 'react-native';

import { RecipeCardSkeleton } from '@/components/RecipeCardSkeleton';
import { spacing } from '@/constants/theme';

type RecipeListSkeletonProps = {
  count?: number;
};

export default function RecipeListSkeleton({ count = 5 }: RecipeListSkeletonProps) {
  return (
    <View style={styles.wrap}>
      {Array.from({ length: count }, (_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.lg,
  },
});
