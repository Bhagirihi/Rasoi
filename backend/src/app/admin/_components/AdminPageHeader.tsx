import type { ReactNode } from 'react';

import { findActiveAdminNav, getAdminSectionLabel } from '@/app/admin/_components/admin-nav';
import { PageHeader } from '@/app/admin/_components/ui';

type AdminPageHeaderProps = {
  /** Nav href used to resolve section + default title/description */
  href: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  backHref?: string;
  backLabel?: string;
};

export default function AdminPageHeader({
  href,
  title,
  description,
  action,
  backHref,
  backLabel,
}: AdminPageHeaderProps) {
  const active = findActiveAdminNav(href);

  return (
    <PageHeader
      title={title ?? active?.item.label ?? 'Admin'}
      section={getAdminSectionLabel(href)}
      description={description ?? active?.item.shortDescription}
      action={action}
      backHref={backHref}
      backLabel={backLabel}
    />
  );
}
