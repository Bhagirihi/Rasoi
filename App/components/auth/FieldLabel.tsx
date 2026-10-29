import { Text, type TextProps } from 'react-native';

import { authStyles as styles } from '@/components/auth/authStyles';

export function FieldLabel({
  children,
  required = false,
  style,
}: {
  children: string;
  required?: boolean;
  style?: TextProps['style'];
}) {
  return (
    <Text style={[styles.label, style]}>
      {children}
      {required ? <Text style={styles.labelRequired}> *</Text> : null}
    </Text>
  );
}
