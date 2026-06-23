import { ChefHat } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View, type ImageStyle, type StyleProp } from 'react-native';

import { colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

const MAX_LOAD_ATTEMPTS = 3;

type RecipeImageProps = {
  uri: string;
  style: StyleProp<ImageStyle>;
  /** Use on dark hero cards so the fallback matches the gradient. */
  tone?: 'default' | 'onDark';
};

export default function RecipeImage({ uri, style, tone = 'default' }: RecipeImageProps) {
  const { semantic } = useTheme();
  const normalizedUri = uri?.trim() ?? '';
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(Boolean(normalizedUri));

  useEffect(() => {
    setFailed(false);
    setAttempt(0);
    setLoading(Boolean(normalizedUri));
  }, [normalizedUri]);

  const handleError = () => {
    setLoading(false);
    if (attempt + 1 < MAX_LOAD_ATTEMPTS) {
      setTimeout(() => setAttempt((value) => value + 1), 400);
      return;
    }
    setFailed(true);
  };

  if (!normalizedUri || failed) {
    const onDark = tone === 'onDark';
    return (
      <View
        style={[
          style,
          styles.fallback,
          {
            backgroundColor: onDark ? 'rgba(255,255,255,0.08)' : semantic.surfaceMuted,
            borderWidth: onDark ? 1 : 0,
            borderColor: onDark ? 'rgba(255,255,255,0.12)' : 'transparent',
          },
        ]}
      >
        <ChefHat size={28} color={onDark ? colors.white : colors.primary} />
      </View>
    );
  }

  return (
    <View style={style}>
      <Image
        key={`${normalizedUri}-${attempt}`}
        source={{ uri: normalizedUri }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={handleError}
      />
      {loading ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.loadingOverlay,
            { backgroundColor: tone === 'onDark' ? 'rgba(0,0,0,0.2)' : semantic.surfaceMuted },
          ]}
        >
          <ActivityIndicator size="small" color={tone === 'onDark' ? colors.white : colors.primary} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
