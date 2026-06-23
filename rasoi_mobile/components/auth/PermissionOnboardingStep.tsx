import { LinearGradient } from 'expo-linear-gradient';
import { Info } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppSavingOverlay from '@/components/AppSavingOverlay';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import { colors, gradients, scrollIndicator } from '@/constants/theme';
import { testIds } from '@/constants/testIds';

type PermissionOnboardingStepProps = {
  screenTestID?: string;
  skipTestID?: string;
  savingMessage?: string;
  savingSubtitle?: string;
  title: ReactNode;
  subtitle: ReactNode;
  icon: ReactNode;
  enableLabel: string;
  enableIcon: ReactNode;
  infoText: string;
  isSubmitting: boolean;
  onEnable: () => void;
  onSkip: () => void;
};

export default function PermissionOnboardingStep({
  screenTestID = testIds.screenOnboarding,
  skipTestID,
  savingMessage = 'Setting up your Rasoi…',
  savingSubtitle = 'Saving tastes and reminders',
  title,
  subtitle,
  icon,
  enableLabel,
  enableIcon,
  infoText,
  isSubmitting,
  onEnable,
  onSkip,
}: PermissionOnboardingStepProps) {
  return (
    <View style={styles.darkRoot}>
      <AppSavingOverlay visible={isSubmitting} message={savingMessage} subtitle={savingSubtitle} />
      <LinearGradient colors={['#0A0908', '#0F1210', '#0A0908']} style={StyleSheet.absoluteFillObject} />
      <View style={styles.glowGreen} />

      <SafeAreaView style={styles.flex} edges={['top', 'bottom']} testID={screenTestID}>
        <View style={styles.header}>
          <Text style={styles.brand}>Rasoi</Text>
        </View>

        <ScrollViewWithFloatingIndicator {...scrollIndicator} contentContainerStyle={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <View style={styles.iconWrap}>{icon}</View>
        </ScrollViewWithFloatingIndicator>

        <View style={styles.footer}>
          <Pressable
            onPress={onEnable}
            disabled={isSubmitting}
            style={[styles.buttonWrap, isSubmitting && styles.buttonDisabled]}
          >
            <LinearGradient
              colors={[...gradients.cta]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>{enableLabel}</Text>
              {enableIcon}
            </LinearGradient>
          </Pressable>

          <View style={styles.infoPill}>
            <Info size={14} color={colors.white} />
            <Text style={styles.infoPillText}>{infoText}</Text>
          </View>

          <Pressable onPress={onSkip} disabled={isSubmitting} testID={skipTestID}>
            <Text style={styles.skip}>Maybe later</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

export function PermissionIconBadge({ children }: { children: ReactNode }) {
  return (
    <View style={styles.iconBadgeWrap}>
      <View style={styles.iconRingOuter} />
      <View style={styles.iconRingInner} />
      <View style={styles.iconDotGreen} />
      <View style={styles.iconDotOrange} />
      <View style={styles.iconCircle}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  darkRoot: {
    flex: 1,
    backgroundColor: colors.dark.bg,
  },
  glowGreen: {
    position: 'absolute',
    right: -80,
    bottom: 120,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(0,168,107,0.12)',
  },
  header: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 8,
    alignItems: 'center',
  },
  title: {
    marginTop: 24,
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 44,
    textAlign: 'center',
    color: colors.dark.text,
  },
  subtitle: {
    marginTop: 16,
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    color: colors.dark.textMuted,
  },
  iconWrap: {
    marginTop: 48,
  },
  iconBadgeWrap: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRingOuter: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.15)',
  },
  iconRingInner: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.25)',
  },
  iconDotGreen: {
    position: 'absolute',
    top: 28,
    right: 36,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  iconDotOrange: {
    position: 'absolute',
    bottom: 36,
    left: 32,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  buttonWrap: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.charcoal,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    borderRadius: 999,
    backgroundColor: colors.charcoal,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  infoPillText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
  },
  skip: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark.textMuted,
  },
  buttonDisabled: { opacity: 0.6 },
});
