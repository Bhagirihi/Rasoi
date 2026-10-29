import type { Metadata } from 'next';

import { ADMIN_NOINDEX_METADATA } from '@/lib/seo';

export const metadata: Metadata = {
  ...ADMIN_NOINDEX_METADATA,
  title: 'Rasoi Admin Login',
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-sidebar-grain relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,162,39,0.12),transparent_35%)]" />
      <div className="relative z-[1] flex min-h-screen items-center justify-center px-6 py-12">
        {children}
      </div>
    </div>
  );
}
