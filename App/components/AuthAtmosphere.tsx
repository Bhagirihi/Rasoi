import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

/**
 * Dark cinematic backdrop used on login/register.
 * Mount once under the app shell when appearance is Dark so tab screens
 * can use a transparent background and let the glows show through.
 */
export default function AuthAtmosphere() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <LinearGradient
        colors={['#0A0908', '#12100E', '#0A0908']}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.glowGreen} />
      <View style={styles.glowOrange} />
    </View>
  );
}

/** Opaque fallback under atmosphere (status bar / overscroll). */
export const AUTH_ATMOSPHERE_BG = colors.dark.bg;

const styles = StyleSheet.create({
  glowGreen: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(0,168,107,0.12)',
  },
  glowOrange: {
    position: 'absolute',
    bottom: 120,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,107,53,0.1)',
  },
});
