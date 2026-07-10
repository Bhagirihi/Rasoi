import ContactEmailLink from '@/app/_components/ContactEmailLink';
import { LEGAL_CONTACT_EMAIL } from '@/lib/legal-content';

type LegalSectionBodyProps = {
  body: string;
};

export default function LegalSectionBody({ body }: LegalSectionBodyProps) {
  if (!body.includes(LEGAL_CONTACT_EMAIL)) {
    return <p className="mt-3 text-sm leading-relaxed text-landing-muted">{body}</p>;
  }

  const [before, after] = body.split(LEGAL_CONTACT_EMAIL);

  return (
    <p className="mt-3 text-sm leading-relaxed text-landing-muted">
      {before}
      <ContactEmailLink className="font-semibold text-landing-saffron hover:text-landing-ink" />
      {after}
    </p>
  );
}
