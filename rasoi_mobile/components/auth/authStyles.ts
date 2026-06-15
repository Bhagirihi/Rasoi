import { StyleSheet } from 'react-native';

import { colors } from '@/constants/theme';

export const authStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  brand: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.primary,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  title: {
    marginTop: 8,
    fontSize: 30,
    fontWeight: '700',
    color: colors.charcoal,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
  },
  summaryCard: {
    marginTop: 20,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryDietIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCuisineImage: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  summaryValue: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.charcoal,
  },
  form: {
    marginTop: 24,
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.charcoal,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  inputRowError: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(229,57,53,0.04)',
  },
  countryCode: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: colors.muted,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.charcoal,
  },
  otpInput: {
    letterSpacing: 4,
    fontWeight: '700',
  },
  hint: {
    fontSize: 12,
    color: colors.muted,
  },
  resendWrap: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  errorBox: {
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(229,57,53,0.08)',
    padding: 12,
  },
  infoBox: {
    backgroundColor: 'rgba(0,168,107,0.08)',
  },
  error: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: colors.danger,
  },
  infoText: {
    color: colors.green,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.cream,
  },
  submitWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  guestButton: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingVertical: 14,
  },
  guestButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.charcoal,
  },
  switchAuthWrap: {
    marginTop: 14,
    alignItems: 'center',
  },
  switchAuthText: {
    fontSize: 14,
    color: colors.muted,
  },
  switchAuthLink: {
    fontWeight: '700',
    color: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  disclaimer: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 16,
    color: colors.muted,
  },
});
