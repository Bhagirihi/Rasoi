import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';
import { Check } from 'lucide-react-native';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { authStyles as styles } from '@/components/auth/authStyles';
import { testIds } from '@/constants/testIds';
import {
  LEGAL_URLS,
  PRIVACY_HIGHLIGHTS,
  TERMS_HIGHLIGHTS,
} from '@/constants/legalHighlights';
import { colors, gradients, radius, spacing } from '@/constants/theme';

type TermsAcceptanceModalProps = {
  visible: boolean;
  checked: boolean;
  onToggleChecked: () => void;
  onCancel: () => void;
  onContinue: () => void;
};

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

export default function TermsAcceptanceModal({
  visible,
  checked,
  onToggleChecked,
  onCancel,
  onContinue,
}: TermsAcceptanceModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={localStyles.backdrop}>
        <View style={localStyles.card}>
          <ScrollView
            style={localStyles.scrollArea}
            contentContainerStyle={localStyles.scrollContent}
            showsVerticalScrollIndicator
            bounces={false}
          >
            <Text style={localStyles.title}>Terms & Privacy</Text>
            <Text style={localStyles.body}>
              Key points before you create your Rasoi account. Full documents are linked below.
            </Text>

            <View style={localStyles.highlightsBox}>
              <HighlightSection title="Terms of Service" items={TERMS_HIGHLIGHTS} />
              <HighlightSection title="Privacy Policy" items={PRIVACY_HIGHLIGHTS} />

              <View style={localStyles.fullLinksRow}>
                <Text style={localStyles.fullLinksLabel}>Full documents: </Text>
                <Text
                  style={localStyles.link}
                  onPress={() => void Linking.openURL(LEGAL_URLS.terms)}
                >
                  Terms
                </Text>
                <Text style={localStyles.fullLinksLabel}> · </Text>
                <Text
                  style={localStyles.link}
                  onPress={() => void Linking.openURL(LEGAL_URLS.privacy)}
                >
                  Privacy
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={localStyles.footer}>
            <Pressable onPress={onToggleChecked} style={localStyles.checkRow} testID={testIds.registerTermsCheckbox}>
              <View style={[localStyles.checkbox, checked && localStyles.checkboxChecked]}>
                {checked ? <Check size={14} color={colors.white} strokeWidth={3} /> : null}
              </View>
              <Text style={localStyles.checkLabel}>
                I have read and agree to the Terms of Service and Privacy Policy.
              </Text>
            </Pressable>

            <Pressable
              onPress={onContinue}
              disabled={!checked}
              style={[localStyles.continueWrap, !checked && styles.buttonDisabled]}
              testID={testIds.registerTermsContinue}
            >
              <LinearGradient
                colors={[...gradients.cta]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Continue</Text>
              </LinearGradient>
            </Pressable>

            <Pressable onPress={onCancel} style={localStyles.cancelBtn}>
              <Text style={localStyles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 9, 8, 0.55)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    maxHeight: '88%',
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  scrollArea: {
    flexGrow: 0,
    flexShrink: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  footer: {
    flexShrink: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 20,
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
    marginTop: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    paddingBottom: spacing.sm,
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
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkLabel: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: colors.charcoal,
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  continueWrap: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cancelBtn: {
    marginTop: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.muted,
  },
});
