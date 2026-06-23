import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { authStyles as styles } from '@/components/auth/authStyles';
import {
  CURRENT_TERMS_VERSION,
  LEGAL_URLS,
  PRIVACY_HIGHLIGHTS,
  TERMS_HIGHLIGHTS,
} from '@/constants/legalHighlights';
import { colors, radius, spacing } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
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
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleContinue = async () => {
    if (!checked || busy) return;
    setBusy(true);
    try {
      await saveLegalConsent();
      markTelemetryStarted();
      router.replace('/(auth)/login');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={localStyles.safe} edges={['top', 'bottom']} testID={testIds.screenLegalConsent}>
      <ScrollView
        style={localStyles.flex}
        contentContainerStyle={localStyles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={localStyles.brand}>RASOI</Text>
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
            trackColor={{ false: colors.border, true: colors.primary }}
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
  );
}

const localStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.cream,
    zIndex: 2,
    elevation: 4,
  },
  brand: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 4,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.charcoal,
  },
  body: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 22,
    color: colors.muted,
  },
  highlightsBox: {
    marginTop: spacing.lg,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.charcoal,
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
    color: colors.charcoal,
  },
  fullLinksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  fullLinksLabel: {
    fontSize: 12,
    color: colors.muted,
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
    color: colors.charcoal,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    overflow: 'hidden',
  },
});
