import JsonLd from '@/app/_components/JsonLd';
import PlayStoreLanding from '@/app/_components/PlayStoreLanding';
import { PLAY_STORE_SEO_PATH } from '@/lib/app-download';
import {
  absoluteUrl,
  faqJsonLd,
  mobileAppJsonLd,
  PLAY_STORE_FAQ_ITEMS,
  playStoreBreadcrumbJsonLd,
  playStoreJsonLdBundle,
  playStoreMetadata,
} from '@/lib/seo';

export const metadata = playStoreMetadata;

export default function PlayStorePage() {
  const pageUrl = absoluteUrl(PLAY_STORE_SEO_PATH);

  return (
    <>
      <JsonLd data={playStoreJsonLdBundle(pageUrl)} />
      <JsonLd data={mobileAppJsonLd(pageUrl)} />
      <JsonLd data={playStoreBreadcrumbJsonLd()} />
      <JsonLd data={faqJsonLd(PLAY_STORE_FAQ_ITEMS)} />
      <PlayStoreLanding />
    </>
  );
}
