import * as Linking from 'expo-linking';
import { Redirect, useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppSavingOverlay from '@/components/AppSavingOverlay';
import AuthAtmosphere, { AUTH_ATMOSPHERE_BG } from '@/components/AuthAtmosphere';
import RasoiWordmark from '@/components/RasoiWordmark';
import { authStyles as styles } from '@/components/auth/authStyles';
import {
  CURRENT_TERMS_VERSION,
  LEGAL_URLS,
  PRIVACY_HIGHLIGHTS,
  TERMS_HIGHLIGHTS,
} from '@/constants/legalHighlights';
import { colors, radius, spacing } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import { useAppContext } from '@/context/AppContext';
import { resolvePostAuthHref } from '@/utils/authNavigation';
import { saveLegalConsent } from '@/utils/legalConsent';
import { markTelemetryStarted } from '@/utils/telemetry';

function HighlightSection({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <View style={localStyles.section}>
      <Text style={localStyles.sectionTitle}>{title}</Text>
      {items.map((item) => (
        <View key={item} style={localStyles.bulletRow}>
          <Text style={localStyles.bullet}>•</Text>
          <Text style={localStyles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export default function LegalConsentScreen() {
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const fromRegister = from === 'register';
  const { pendingPantrySetup, pendingTrialWelcome, userCity, hasCompletedOnboarding, isHydrated } =
    useAppContext();
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);

  if (isHydrated && !fromRegister) {
    return <Redirect href="/(auth)/login" />;
  }

  const handleContinue = async () => {
    if (!checked || busy) return;
    setBusy(true);
    try {
      await saveLegalConsent();
      markTelemetryStarted();

      const href = await resolvePostAuthHref(
        { showTrialWelcome: pendingTrialWelcome, hasCompletedOnboarding, userCity },
        { userCity, pendingPantrySetup },
      );
      router.replace(href as Href);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={localStyles.root}>
      <AuthAtmosphere />
      <SafeAreaView style={localStyles.safe} edges={['top', 'bottom']} testID={testIds.screenLegalConsent}>
        <AppSavingOverlay
          visible={busy}
          message="Opening Rasoi…"
          subtitle="Setting up your kitchen"
        />
        <ScrollView
          style={localStyles.flex}
          contentContainerStyle={localStyles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={localStyles.brandBlock}>
            <RasoiWordmark size="bar" />
            <View style={localStyles.brandAccent} />
          </View>
          <Text style={localStyles.title}>Terms & Privacy</Text>
          <Text style={localStyles.body}>
            Please review these key points before using Rasoi. Analytics and crash reporting start only
            after you agree (version {CURRENT_TERMS_VERSION}).
          </Text>

          <View style={localStyles.highlightsBox}>
            <HighlightSection title="Terms of Service" items={TERMS_HIGHLIGHTS} />
            <HighlightSection title="Privacy Policy" items={PRIVACY_HIGHLIGHTS} />

            <View style={localStyles.fullLinksRow}>
              <Text style={localStyles.fullLinksLabel}>Full documents: </Text>
              <Text style={localStyles.link} onPress={() => void Linking.openURL(LEGAL_URLS.terms)}>
                Terms
              </Text>
              <Text style={localStyles.fullLinksLabel}> · </Text>
              <Text style={localStyles.link} onPress={() => void Linking.openURL(LEGAL_URLS.privacy)}>
                Privacy
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={localStyles.footer}>
          <View style={localStyles.checkRow}>
            <Switch
              value={checked}
              onValueChange={setChecked}
              testID={testIds.legalConsentCheckbox}
              trackColor={{ false: 'rgba(255,255,255,0.18)', true: colors.primary }}
              thumbColor={colors.white}
            />
            <Pressable
              onPress={() => setChecked((value) => !value)}
              style={localStyles.checkLabelPressable}
              accessibilityLabel="I have read and agree to the Terms of Service and Privacy Policy."
            >
              <Text style={localStyles.checkLabel}>
                I have read and agree to the Terms of Service and Privacy Policy.
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => {
              if (!checked || busy) return;
              void handleContinue();
            }}
            testID={testIds.legalConsentContinue}
            accessibilityRole="button"
            accessibilityLabel="Continue"
            style={[
              styles.submitButton,
              localStyles.continueButton,
              (!checked || busy) && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.submitButtonText}>{busy ? 'Please wait…' : 'Continue'}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AUTH_ATMOSPHERE_BG,
  },
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flex: {
    flex: 1,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  brandBlock: {
    gap: 4,
    marginBottom: spacing.lg,
  },
  brandAccent: {
    height: 2,
    width: 28,
    borderRadius: 1,
    backgroundColor: colors.primary,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    backgroundColor: AUTH_ATMOSPHERE_BG,
    zIndex: 2,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.dark.text,
  },
  body: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 22,
    color: colors.dark.textMuted,
  },
  highlightsBox: {
    marginTop: spacing.lg,
    borderRadius: radius.sm,
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.dark.text,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  bullet: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 1,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: colors.dark.textMuted,
  },
  fullLinksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  fullLinksLabel: {
    fontSize: 12,
    color: colors.dark.textMuted,
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  checkLabelPressable: {
    flex: 1,
    paddingTop: 2,
  },
  checkLabel: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.dark.text,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    overflow: 'hidden',
  },
});
