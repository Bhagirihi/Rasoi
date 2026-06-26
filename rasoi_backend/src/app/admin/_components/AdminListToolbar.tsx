import type { ReactNode } from 'react';

/** Optional row above tables: filters on the left, actions/meta on the right */
export default function AdminListToolbar({
  filters,
  actions,
  meta,
}: {
  filters?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
}) {
  if (!filters && !actions && !meta) return null;

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0 flex-1 space-y-4">
        {meta ? <div className="text-sm text-admin-muted">{meta}</div> : null}
        {filters}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
