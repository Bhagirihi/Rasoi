'use client';

import { useEffect, useState } from 'react';

import { LEGAL_CONTACT_EMAIL } from '@/lib/legal-content';

type ContactEmailLinkProps = {
  className?: string;
  label?: string;
};

/** Client-only mailto avoids Cloudflare email-decode.min.js on SSR HTML. */
export default function ContactEmailLink({
  className = '',
  label = LEGAL_CONTACT_EMAIL,
}: ContactEmailLinkProps) {
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    setHref(`mailto:${LEGAL_CONTACT_EMAIL}`);
  }, []);

  if (!href) {
    return <span className={className}>{label}</span>;
  }

  return (
    <a href={href} className={className}>
      {label}
    </a>
  );
}
