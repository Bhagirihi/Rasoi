import LegalDocumentPage from '@/app/_components/LegalDocumentPage';
import { termsSections } from '@/lib/legal-content';
import { APP_NAME } from '@/lib/app-download';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: `Terms of Service — ${APP_NAME}`,
  description: `Terms for using ${APP_NAME}, the Indian home-cooking app, and rasoiapplication.in.`,
  path: '/terms',
});

export default function TermsPage() {
  return (
    <LegalDocumentPage
      title="Terms of Service"
      description="Please read these terms before using Rasoi. They govern your use of the app and website."
      lastUpdated="21 June 2026"
      sections={termsSections}
    />
  );
}
