import type { ReactNode } from 'react';

/** Shared wrapper for filter chip panels on list pages */
export default function AdminFilterShell({ children }: { children: ReactNode }) {
  return <div className="admin-card space-y-5 rounded-[1.25rem] p-5">{children}</div>;
}
