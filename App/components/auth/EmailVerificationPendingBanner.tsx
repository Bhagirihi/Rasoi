import { LinearGradient } from 'expo-linear-gradient';
import { AlertCircle, Mail } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { maskEmail } from '@/utils/authLogger';

export default function EmailVerificationPendingBanner() {
  const insets = useSafeAreaInsets();
  const { pendingEmailVerification, openEmailVerificationModal, isGuest } = useAppContext();

  if (!pendingEmailVerification || !isGuest) return null;

  const masked = maskEmail(pendingEmailVerification.email);
  const actionLabel =
    pendingEmailVerification.flow === 'signup' ? 'Finish account setup' : 'Verify to sign in';

  return (
    <View pointerEvents="box-none" style={[styles.host, { top: insets.top + spacing.sm }]}>
      <Pressable onPress={openEmailVerificationModal} style={styles.wrap}>
        <LinearGradient
          colors={['#1E3A5F', '#2A4A73']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.iconWrap}>
            <AlertCircle size={18} color={colors.white} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.title}>Email verification pending</Text>
            <Text style={styles.sub}>
              {masked} · Tap to {actionLabel.toLowerCase()}
            </Text>
          </View>
          <Mail size={18} color={colors.white} />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 50,
  },
  wrap: {
    borderRadius: radius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.white,
  },
  sub: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(255,255,255,0.92)',
  },
});
