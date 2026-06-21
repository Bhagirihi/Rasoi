import LegalDocumentPage from '@/app/_components/LegalDocumentPage';
import { privacySections } from '@/lib/legal-content';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Privacy Policy — Rasoi App',
  description:
    'How Rasoi collects, uses, and protects your information when you use the Indian recipe app and rasoiapplication.in.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <LegalDocumentPage
      title="Privacy Policy"
      description="This policy explains what data Rasoi collects when you use our Android app and website, and how we use it."
      lastUpdated="21 June 2026"
      sections={privacySections}
    />
  );
}
