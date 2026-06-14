import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Rasoi Admin',
  description: 'Manage recipes, sponsors, partner links, and members.',
};

import AdminSidebar from '@/app/admin/_components/AdminSidebar';
import RealtimeRefresh from '@/app/admin/_components/RealtimeRefresh';
import { clearAdminToken } from '@/app/admin/actions';
import { getAdminFromCookies } from '@/lib/auth';

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
      <div className="flex min-h-screen flex-col lg:flex-row">
        <AdminSidebar adminName={admin.name} logoutAction={clearAdminToken} />
        <div className="flex-1 overflow-auto">
          <main className="mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
