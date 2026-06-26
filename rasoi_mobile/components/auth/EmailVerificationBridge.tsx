import { useRouter } from 'expo-router';

import EmailVerificationModal from '@/components/auth/EmailVerificationModal';
import EmailVerificationPendingBanner from '@/components/auth/EmailVerificationPendingBanner';
import { useAppContext, type AuthNavigationResult } from '@/context/AppContext';
import { resolvePostAuthHref } from '@/utils/authNavigation';

export default function EmailVerificationBridge() {
  const router = useRouter();
  const {
    emailVerificationModalVisible,
    closeEmailVerificationModal,
    userCity,
    pendingPantrySetup,
  } = useAppContext();

  const navigateAfterVerify = async ({ showTrialWelcome, hasCompletedOnboarding }: AuthNavigationResult) => {
    const href = await resolvePostAuthHref(
      { showTrialWelcome, hasCompletedOnboarding },
      { userCity, pendingPantrySetup },
    );
    router.replace(href);
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
