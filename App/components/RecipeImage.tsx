import { ChefHat } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image as RNImage,
  StyleSheet,
  View,
  type ImageStyle,
  type StyleProp,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';

import { colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { getRecipeImageCandidates, getRecipeImageSource } from '@/utils/recipeImage';

const MAX_LOAD_ATTEMPTS = 3;

type RecipeImageProps = {
  uri: string;
  style: StyleProp<ImageStyle>;
  /** Use on dark hero cards so the fallback matches the gradient. */
  tone?: 'default' | 'onDark';
};

/**
 * Prefetch via expo-image cache. Display uses RN Image + wsrv baseline proxy
 * (progressive catalog JPEGs paint black on Android otherwise).
 */
export function prefetchRecipeImages(uris: Array<string | undefined | null>): void {
  for (const raw of uris.slice(0, 12)) {
    const uri = raw?.trim();
    if (!uri) continue;
    const [primary] = getRecipeImageCandidates(uri);
    if (!primary) continue;
    void ExpoImage.prefetch(primary).catch(() => undefined);
  }
}

export default function RecipeImage({ uri, style, tone = 'default' }: RecipeImageProps) {
  const { semantic } = useTheme();
  const normalizedUri = uri?.trim() ?? '';
  const candidates = getRecipeImageCandidates(normalizedUri);
  const [failed, setFailed] = useState(false);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(Boolean(normalizedUri));

  useEffect(() => {
    setFailed(false);
    setCandidateIndex(0);
    setAttempt(0);
    setLoading(Boolean(normalizedUri));
  }, [normalizedUri]);

  const activeUri = candidates[Math.min(candidateIndex, Math.max(candidates.length - 1, 0))] ?? '';

  const handleError = () => {
    setLoading(false);
    if (candidateIndex + 1 < candidates.length) {
      setCandidateIndex((value) => value + 1);
      setAttempt(0);
      setLoading(true);
      return;
    }
    if (attempt + 1 < MAX_LOAD_ATTEMPTS) {
      setTimeout(() => setAttempt((value) => value + 1), 400);
      return;
    }
    setFailed(true);
  };

  if (!normalizedUri || failed || !activeUri) {
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
      <RNImage
        key={`${activeUri}-${attempt}`}
        source={getRecipeImageSource(activeUri)}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
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
