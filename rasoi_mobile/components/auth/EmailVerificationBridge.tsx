import { useRouter } from 'expo-router';

import EmailVerificationModal from '@/components/auth/EmailVerificationModal';
import EmailVerificationPendingBanner from '@/components/auth/EmailVerificationPendingBanner';
import { useAppContext } from '@/context/AppContext';

export default function EmailVerificationBridge() {
  const router = useRouter();
  const {
    emailVerificationModalVisible,
    closeEmailVerificationModal,
    hasCompletedOnboarding,
  } = useAppContext();

  const navigateAfterVerify = (showTrialWelcome: boolean) => {
    if (!hasCompletedOnboarding) {
      router.replace('/(auth)/onboarding');
      return;
    }
    if (showTrialWelcome) {
      router.replace('/(auth)/trial-welcome');
      return;
    }
    router.replace('/(tabs)');
  };

  return (
    <>
      <EmailVerificationPendingBanner />
      <EmailVerificationModal
        visible={emailVerificationModalVisible}
        onClose={closeEmailVerificationModal}
        onVerified={navigateAfterVerify}
      />
    </>
  );
}
