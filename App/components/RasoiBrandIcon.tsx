import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

const brandIcon = require('../assets/images/icon.png');

type RasoiBrandIconProps = {
  size?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};

/** App icon without the white matte padding in splash-icon.png */
export default function RasoiBrandIcon({
  size = 88,
  borderRadius,
  style,
}: RasoiBrandIconProps) {
  const radius = borderRadius ?? Math.round(size * 0.22);

  return (
    <View style={[styles.clip, { width: size, height: size, borderRadius: radius }, style]}>
      <Image source={brandIcon} style={{ width: size, height: size }} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
});
