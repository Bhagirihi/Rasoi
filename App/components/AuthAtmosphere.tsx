import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

/**
 * Dark cinematic backdrop used on login/register/onboarding.
 * Top orange brand bar + warm glow soften the jump into the light cream app.
 */
export default function AuthAtmosphere() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <LinearGradient
        colors={['#120E0C', '#12100E', '#0A0908']}
        locations={[0, 0.35, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      {/* Shared brand signal with light tabs (primary orange). */}
      <LinearGradient
        colors={['rgba(255,107,53,0.55)', 'rgba(255,107,53,0.12)', 'transparent']}
        style={styles.brandWash}
      />
      <View style={styles.brandBar} />
      <View style={styles.glowOrangeTop} />
      <View style={styles.glowGreen} />
      <View style={styles.glowOrange} />
    </View>
  );
}

/** Opaque fallback under atmosphere (status bar / overscroll). */
export const AUTH_ATMOSPHERE_BG = colors.dark.bg;

const styles = StyleSheet.create({
  brandBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primary,
  },
  brandWash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  glowOrangeTop: {
    position: 'absolute',
    top: -40,
    left: '20%',
    width: 200,
    height: 120,
    borderRadius: 100,
    backgroundColor: 'rgba(255,107,53,0.14)',
  },
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
