import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import AdminConsoleShell from '@/app/admin/_components/AdminConsoleShell';
import RealtimeRefresh from '@/app/admin/_components/RealtimeRefresh';
import { clearAdminToken } from '@/app/admin/actions';
import { getAdminFromCookies } from '@/lib/auth';
import { ADMIN_NOINDEX_METADATA } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...ADMIN_NOINDEX_METADATA,
  title: 'Rasoi Admin Console',
  description: 'Manage recipes, sponsors, partner links, and members.',
};

export default async function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminFromCookies();
  if (!admin) redirect('/admin/login');

  return (
    <div className="admin-grain min-h-screen">
      <RealtimeRefresh />
      <AdminConsoleShell adminName={admin.name} logoutAction={clearAdminToken}>
        {children}
      </AdminConsoleShell>
    </div>
  );
}
