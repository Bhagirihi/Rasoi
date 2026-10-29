import { ChefHat } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, type ImageStyle, type StyleProp } from 'react-native';
import { Image } from 'expo-image';

import { colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

const MAX_LOAD_ATTEMPTS = 3;

type RecipeImageProps = {
  uri: string;
  style: StyleProp<ImageStyle>;
  /** Use on dark hero cards so the fallback matches the gradient. */
  tone?: 'default' | 'onDark';
};

/**
 * Prefetch hero images for the first screen so list scrolling never waits on
 * the network. expo-image dedupes against its memory-disk cache, so repeated
 * calls are cheap.
 */
export function prefetchRecipeImages(uris: Array<string | undefined | null>): void {
  for (const raw of uris.slice(0, 12)) {
    const uri = raw?.trim();
    if (uri) void Image.prefetch(uri).catch(() => undefined);
  }
}

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
        contentFit="cover"
        // memory-disk: list images survive scroll-away and app restarts without
        // re-download; remounts on retry hit the cache instead of the network.
        cachePolicy="memory-disk"
        onLoadStart={() => setLoading(true)}
        onLoad={() => setLoading(false)}
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
