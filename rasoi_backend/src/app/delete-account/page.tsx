import LegalDocumentPage from '@/app/_components/LegalDocumentPage';
import { LEGAL_CONTACT_EMAIL } from '@/lib/legal-content';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Delete Account — Rasoi App',
  description:
    'How to delete your Rasoi account and personal data from the Rasoi Android app or by email.',
  path: '/delete-account',
});

const sections = [
  {
    title: 'Delete in the app (recommended)',
    body:
      'Open Rasoi → Settings → Account → Delete account. Registered users must confirm their email address. Guest users can delete immediately. This removes your profile, saved recipes, pantry, push tokens, and linked Supabase sign-in where applicable.',
  },
  {
    title: 'Export your data first',
    body:
      'Before deleting, you can export a copy of your account data from Settings → Export my data (JSON). This includes your profile, saved recipes, pantry, and recent activity logs tied to your account.',
  },
  {
    title: 'Delete by email',
    body: `If you cannot access the app, email ${LEGAL_CONTACT_EMAIL} from your registered address with the subject "Delete my Rasoi account". We will verify ownership and complete deletion within 30 days as required by applicable law.`,
  },
  {
    title: 'Google Play subscriptions',
    body:
      'Deleting your Rasoi account does not cancel an active Rasoi Plus subscription. Cancel in Google Play → Payments & subscriptions → Subscriptions → Rasoi Plus.',
  },
] as const;

export default function DeleteAccountPage() {
  return (
    <LegalDocumentPage
      title="Delete your account"
      description="Remove your Rasoi profile and personal data."
      lastUpdated="21 June 2026"
      sections={sections}
    />
  );
}
