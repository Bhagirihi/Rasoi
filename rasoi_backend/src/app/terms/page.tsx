import LegalDocumentPage from '@/app/_components/LegalDocumentPage';
import { termsSections } from '@/lib/legal-content';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Terms of Service — Rasoi App',
  description: 'Terms for using the Rasoi Indian home-cooking app and rasoiapplication.in.',
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
