import type { ReactNode } from 'react';

import { AdminCard } from '@/app/admin/_components/ui';

export default function AdminPanel({
  title,
  description,
  action,
  children,
  className = '',
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <AdminCard className={`p-6 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="admin-panel-title">{title}</p>
          {description ? (
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-admin-muted">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </AdminCard>
  );
}
