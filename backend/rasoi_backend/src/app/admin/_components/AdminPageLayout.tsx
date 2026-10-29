import type { ReactNode } from 'react';

/** Consistent vertical rhythm for every admin page */
export default function AdminPageLayout({ children }: { children: ReactNode }) {
  return <div className="admin-page space-y-6">{children}</div>;
}
