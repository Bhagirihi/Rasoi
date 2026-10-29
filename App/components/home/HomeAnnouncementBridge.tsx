import HomeAnnouncementBanner from '@/components/home/HomeAnnouncementBanner';
import HomeAnnouncementModal from '@/components/home/HomeAnnouncementModal';
import { useHomeAnnouncement } from '@/hooks/useHomeAnnouncement';

export default function HomeAnnouncementBridge() {
  const { announcement, showBanner, modalVisible, dismiss, handleCta } = useHomeAnnouncement();

  if (!announcement) return null;

  return (
    <>
      {showBanner ? (
        <HomeAnnouncementBanner announcement={announcement} onDismiss={() => void dismiss()} onCta={() => void handleCta()} />
      ) : null}
      <HomeAnnouncementModal
        visible={modalVisible}
        announcement={announcement}
        onDismiss={() => void dismiss()}
        onCta={() => void handleCta()}
      />
    </>
  );
}
