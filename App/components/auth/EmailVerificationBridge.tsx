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
    pendingPantrySetup,
  } = useAppContext();

  const navigateAfterVerify = async (nav: AuthNavigationResult) => {
    const href = await resolvePostAuthHref(nav, {
      userCity: nav.userCity,
      pendingPantrySetup,
    });
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
