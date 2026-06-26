'use client';

import { useState, type ReactNode } from 'react';

import AdminDrawer from '@/app/admin/_components/AdminDrawer';
import AdminSidebar, { AdminSidebarNav } from '@/app/admin/_components/AdminSidebar';
import AdminTopBar from '@/app/admin/_components/AdminTopBar';

export default function AdminConsoleShell({
  adminName,
  logoutAction,
  children,
}: {
  adminName: string;
  logoutAction: () => Promise<void>;
  children: ReactNode;
}) {
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
      <div className="flex min-h-screen flex-col lg:flex-row">
        {!sidebarCollapsed ? (
          <div className="hidden lg:sticky lg:top-0 lg:block lg:h-screen">
            <AdminSidebar
              adminName={adminName}
              logoutAction={logoutAction}
              onCollapse={() => setSidebarCollapsed(true)}
            />
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopBar
            adminName={adminName}
            sidebarCollapsed={sidebarCollapsed}
            onOpenNavDrawer={() => setNavDrawerOpen(true)}
            onExpandSidebar={() => setSidebarCollapsed(false)}
          />

          <div className="flex-1 overflow-auto">
            <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</main>
          </div>
        </div>
      </div>

      <AdminDrawer
        open={navDrawerOpen}
        onClose={() => setNavDrawerOpen(false)}
        title="Navigation"
        subtitle="Jump between admin modules"
        eyebrow="Manage"
        side="left"
        tone="dark"
        hideHeader
      >
        <aside className="admin-sidebar-grain flex h-full flex-col text-admin-cream">
          <AdminSidebarNav
            adminName={adminName}
            logoutAction={logoutAction}
            onNavigate={() => setNavDrawerOpen(false)}
          />
        </aside>
      </AdminDrawer>
    </>
  );
}
