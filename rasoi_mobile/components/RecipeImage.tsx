import { ChefHat } from 'lucide-react-native';
import { useState } from 'react';
import { Image, StyleSheet, View, type ImageStyle, type StyleProp } from 'react-native';

import { colors } from '@/constants/theme';

type RecipeImageProps = {
  uri: string;
  style: StyleProp<ImageStyle>;
};

export default function RecipeImage({ uri, style }: RecipeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!uri || failed) {
    return (
      <View style={[style, styles.fallback]}>
        <ChefHat size={28} color={colors.primary} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={style}
      resizeMode="cover"
      onError={() => setFailed(true)}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
  },
});
