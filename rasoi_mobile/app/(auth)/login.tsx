import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft, Mail } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScrollViewWithFloatingIndicator } from "@/components/ScrollableScreen";
import AppSavingOverlay from "@/components/AppSavingOverlay";
import GuestContinueModal from "@/components/auth/GuestContinueModal";
import RasoiBrandIcon from "@/components/RasoiBrandIcon";
import {
  colors,
  gradients,
  layout,
  scrollIndicator,
  spacing,
} from "@/constants/theme";
import { testIds } from "@/constants/testIds";
import { useAppContext, type AuthNavigationResult } from "@/context/AppContext";
import { authError, authLog, maskEmail } from "@/utils/authLogger";
import { isEmailDeliveryUnavailableError } from "@/utils/emailDeliveryErrors";
import { warmApiConnection } from "@/utils/api";
import { getEmailValidationError, normalizeEmail } from "@/utils/storage";

type LoginStep = "email" | "otp";
type FieldError = "email" | "otp" | "general" | null;

export default function LoginScreen() {
  const router = useRouter();
  const { sendLoginEmailOtp, verifyLoginEmailOtp, loginAsGuest, continueWithPendingEmailVerification } =
    useAppContext();

  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [fieldError, setFieldError] = useState<FieldError>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestError, setGuestError] = useState("");
  const [emailDeliveryBlocked, setEmailDeliveryBlocked] = useState(false);
  const [keyboardInset, setKeyboardInset] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardInset(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardInset(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (step === "otp") warmApiConnection();
  }, [step]);

  const navigateAfterAuth = ({ showTrialWelcome, hasCompletedOnboarding }: AuthNavigationResult) => {
    if (!hasCompletedOnboarding) {
      router.replace("/(auth)/onboarding");
      return;
    }
    if (showTrialWelcome) {
      router.replace("/(auth)/trial-welcome");
      return;
    }
    router.replace("/(tabs)");
  };

  const validateEmail = (): string | null => {
    const emailError = getEmailValidationError(email);
    if (emailError) {
      setFieldError("email");
      setErrorMessage(emailError);
      return null;
    }
    return normalizeEmail(email);
  };

  const handleGuest = async () => {
    setGuestError("");
    setFieldError(null);
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      void Haptics.selectionAsync();
      Keyboard.dismiss();
      const trimmed = guestName.trim();
      const nav = await loginAsGuest(trimmed.length >= 2 ? { name: trimmed } : undefined);
      setShowGuestModal(false);
      navigateAfterAuth(nav);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not continue as guest. Please try again.";
      setGuestError(message);
      setFieldError("general");
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueWithoutEmailVerification = async (normalizedEmail: string) => {
    setIsSubmitting(true);
    try {
      const nav = await continueWithPendingEmailVerification({
        email: normalizedEmail,
        flow: "login",
      });
      setEmailDeliveryBlocked(false);
      if (nav) {
        navigateAfterAuth(nav);
      }
    } catch (error) {
      setFieldError("general");
      setErrorMessage(
        error instanceof Error ? error.message : "Could not continue to the app. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async () => {
    setFieldError(null);
    setErrorMessage("");
    setEmailDeliveryBlocked(false);

    const normalizedEmail = validateEmail();
    if (!normalizedEmail) return;

    setIsSubmitting(true);
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      authLog("login:sendOtp", { email: maskEmail(normalizedEmail) });
      await sendLoginEmailOtp(normalizedEmail);
      setStep("otp");
      setOtp("");
    } catch (error) {
      authError("login:sendOtp_failed", error, {
        email: maskEmail(normalizedEmail),
      });
      setFieldError("general");
      if (isEmailDeliveryUnavailableError(error)) {
        setEmailDeliveryBlocked(true);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Email delivery is temporarily unavailable. You can keep using Rasoi and verify later.",
        );
      } else {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Could not send verification code. Try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    setFieldError(null);
    setErrorMessage("");

    const normalizedEmail = validateEmail();
    if (!normalizedEmail) {
      setStep("email");
      return;
    }

    const code = otp.replace(/\D/g, "").trim();
    if (code.length < 6) {
      setFieldError("otp");
      setErrorMessage("Enter the verification code from your email.");
      return;
    }

    setIsSubmitting(true);
    let verified = false;
    try {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      authLog("login:verifyOtp", {
        email: maskEmail(normalizedEmail),
        otpLength: code.length,
      });
      const nav = await verifyLoginEmailOtp(normalizedEmail, code);
      authLog("login:verifyOtp_success");
      verified = true;
      navigateAfterAuth(nav);
    } catch (error) {
      authError("login:verifyOtp_failed", error, {
        email: maskEmail(normalizedEmail),
      });
      setFieldError("otp");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Invalid or expired code. Please try again.",
      );
    } finally {
      if (!verified) setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setFieldError(null);
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const normalizedEmail = validateEmail();
      if (!normalizedEmail) {
        setStep("email");
        return;
      }
      await sendLoginEmailOtp(normalizedEmail);
      setEmailDeliveryBlocked(false);
      setErrorMessage("A new code was sent to your email.");
    } catch (error) {
      setFieldError("general");
      if (isEmailDeliveryUnavailableError(error)) {
        setEmailDeliveryBlocked(true);
      }
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not resend code. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const backToEmail = () => {
    setStep("email");
    setOtp("");
    setFieldError(null);
    setErrorMessage("");
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#0A0908", "#12100E", "#0A0908"]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.glowGreen} />
      <View style={styles.glowOrange} />

      <SafeAreaView
        style={styles.flex}
        edges={["top", "bottom"]}
        testID={testIds.screenLogin}
      >
        <AppSavingOverlay
          visible={isSubmitting}
          steps={
            showGuestModal
              ? [
                  { message: "Starting guest mode…", subtitle: "Setting up your kitchen" },
                  { message: "Almost ready…", subtitle: "Opening Rasoi" },
                ]
              : step === "otp"
              ? [{ message: "Signing you in…", subtitle: "Verifying code and loading your profile" }]
              : [
                  {
                    message: "Sending verification code…",
                    subtitle: "Check your email in a moment",
                  },
                ]
          }
        />
        <ScrollViewWithFloatingIndicator
            {...scrollIndicator}
            contentContainerStyle={[
              styles.scrollContent,
              keyboardInset > 0 && styles.scrollContentKeyboard,
              { paddingBottom: keyboardInset > 0 ? keyboardInset + 32 : spacing.xl },
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <View style={styles.hero}>
              <RasoiBrandIcon size={112} borderRadius={26} />
              <Text style={styles.brand}>Rasoi</Text>
            </View>

            {step === "otp" && (
              <Pressable onPress={backToEmail} style={styles.backRow}>
                <ArrowLeft size={16} color={colors.primary} />
                <Text style={styles.backText}>Change email</Text>
              </Pressable>
            )}

            <Text style={styles.title}>
              {step === "email" ? "Welcome back" : "Check your email"}
            </Text>
            <Text style={styles.subtitle}>
              {step === "email"
                ? "Sign in with your registered email — we’ll send a one-time code. No password needed."
                : `Enter the code sent to ${normalizeEmail(email)}`}
            </Text>

            <View style={styles.formPanel}>
              {step === "email" ? (
                <View style={styles.field}>
                  <Text style={styles.label}>
                    Email <Text style={styles.labelRequired}>*</Text>
                  </Text>
                  <View
                    style={[
                      styles.inputRow,
                      fieldError === "email" && styles.inputRowError,
                    ]}
                  >
                    <Mail size={18} color={colors.dark.textMuted} />
                    <TextInput
                      value={email}
                      onChangeText={(value) => {
                        setEmail(value);
                        if (fieldError === "email") setFieldError(null);
                      }}
                      placeholder="you@example.com"
                      placeholderTextColor={colors.dark.buttonDisabledText}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="done"
                      onSubmitEditing={handleSendOtp}
                      style={styles.input}
                      testID={testIds.loginEmailInput}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.field}>
                  <Text style={styles.label}>
                    Verification code <Text style={styles.labelRequired}>*</Text>
                  </Text>
                  <View
                    style={[
                      styles.inputRow,
                      fieldError === "otp" && styles.inputRowError,
                    ]}
                  >
                    <Mail size={18} color={colors.dark.textMuted} />
                    <TextInput
                      value={otp}
                      onChangeText={(value) => {
                        setOtp(value.replace(/\D/g, "").slice(0, 8));
                        if (fieldError === "otp") setFieldError(null);
                      }}
                      placeholder="123456"
                      placeholderTextColor={colors.dark.buttonDisabledText}
                      keyboardType="number-pad"
                      maxLength={8}
                      returnKeyType="done"
                      onSubmitEditing={handleVerifyOtp}
                      style={[styles.input, styles.otpInput]}
                      autoFocus
                      testID={testIds.loginOtpInput}
                    />
                  </View>
                  <Pressable
                    onPress={handleResendOtp}
                    disabled={isSubmitting}
                    style={styles.resendWrap}
                  >
                    <Text style={styles.resendText}>Resend code</Text>
                  </Pressable>
                </View>
              )}

              {errorMessage.length > 0 && (
                <View
                  style={[
                    styles.messageBox,
                    fieldError === null && styles.messageBoxInfo,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      fieldError === null && styles.messageTextInfo,
                    ]}
                  >
                    {errorMessage}
                  </Text>
                </View>
              )}

              <Pressable
                onPress={step === "email" ? handleSendOtp : handleVerifyOtp}
                disabled={isSubmitting}
                testID={step === "email" ? testIds.loginSendOtp : testIds.loginVerifyOtp}
                style={[
                  styles.submitWrap,
                  isSubmitting && styles.buttonDisabled,
                ]}
              >
                <LinearGradient
                  colors={[...gradients.cta]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.submitButton}
                >
                  <Text style={styles.submitButtonText}>
                    {step === "email" ? "Send sign-in code" : "Sign in"}
                  </Text>
                </LinearGradient>
              </Pressable>

              {emailDeliveryBlocked && step === "email" ? (
                <Pressable
                  onPress={() => {
                    const normalizedEmail = validateEmail();
                    if (normalizedEmail) {
                      void handleContinueWithoutEmailVerification(normalizedEmail);
                    }
                  }}
                  disabled={isSubmitting}
                  style={styles.guestButton}
                >
                  <Text style={styles.guestButtonText}>Continue to app — verify email later</Text>
                </Pressable>
              ) : null}
            </View>

            {step === "email" ? (
              <>
                <Pressable
                  onPress={() => {
                    setGuestError("");
                    setShowGuestModal(true);
                  }}
                  disabled={isSubmitting}
                  testID={testIds.loginGuest}
                  style={styles.guestButton}
                >
                  <Text style={styles.guestButtonText}>Explore as Guest</Text>
                </Pressable>
                <Pressable
                  onPress={() => router.push("/(auth)/register")}
                  disabled={isSubmitting}
                  style={styles.switchAuthWrap}
                  testID={testIds.loginGoRegister}
                >
                  <Text style={styles.switchAuthText}>
                    New to Rasoi?{" "}
                    <Text style={styles.switchAuthLink}>Create account</Text>
                  </Text>
                </Pressable>
              </>
            ) : (
              <Text style={styles.footerHint}>
                Didn’t get it? Check spam or tap Resend code.
              </Text>
            )}
          </ScrollViewWithFloatingIndicator>
      </SafeAreaView>
      <GuestContinueModal
        visible={showGuestModal}
        name={guestName}
        onChangeName={setGuestName}
        onClose={() => {
          setShowGuestModal(false);
          setGuestError("");
        }}
        onContinue={() => void handleGuest()}
        busy={isSubmitting}
        errorMessage={guestError}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dark.bg,
  },
  flex: {
    flex: 1,
  },
  glowGreen: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(0,168,107,0.12)",
  },
  glowOrange: {
    position: "absolute",
    bottom: 120,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(255,107,53,0.1)",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: layout.screenPadding + 4,
    paddingVertical: spacing.xl,
    gap: spacing.lg,
  },
  scrollContentKeyboard: {
    justifyContent: "flex-start",
    paddingTop: spacing.lg,
  },
  hero: {
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  brand: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: colors.primary,
    textTransform: "uppercase",
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    marginTop: -spacing.sm,
  },
  backText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.dark.text,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.dark.textMuted,
    textAlign: "center",
    marginTop: -spacing.sm,
  },
  formPanel: {
    borderRadius: 20,
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: spacing.lg,
    gap: spacing.md,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
    color: colors.dark.textMuted,
    textTransform: "uppercase",
  },
  labelRequired: {
    color: colors.danger,
    textTransform: "none",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: colors.dark.surface,
    paddingHorizontal: spacing.lg,
  },
  inputRowError: {
    borderColor: "rgba(229,57,53,0.6)",
    backgroundColor: colors.dark.accentRed,
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.dark.text,
  },
  otpInput: {
    letterSpacing: 4,
    fontWeight: "700",
  },
  resendWrap: {
    alignSelf: "flex-start",
    paddingVertical: 2,
  },
  resendText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  messageBox: {
    borderRadius: 12,
    backgroundColor: "rgba(229,57,53,0.12)",
    borderWidth: 1,
    borderColor: "rgba(229,57,53,0.25)",
    padding: spacing.md,
  },
  messageBoxInfo: {
    backgroundColor: "rgba(0,168,107,0.12)",
    borderColor: "rgba(0,168,107,0.25)",
  },
  messageText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "#F87171",
  },
  messageTextInfo: {
    color: colors.green,
  },
  submitWrap: {
    borderRadius: 999,
    overflow: "hidden",
    marginTop: spacing.xs,
  },
  submitButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.white,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  guestButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  guestButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.dark.text,
  },
  switchAuthWrap: {
    alignItems: "center",
  },
  switchAuthText: {
    fontSize: 14,
    color: colors.dark.textMuted,
  },
  switchAuthLink: {
    fontWeight: "700",
    color: colors.primary,
  },
  footerHint: {
    textAlign: "center",
    fontSize: 13,
    lineHeight: 18,
    color: colors.dark.textMuted,
  },
});
