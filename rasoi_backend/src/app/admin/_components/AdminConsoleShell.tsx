'use client';

import { useState, type ReactNode } from 'react';

import AdminDrawer from '@/app/admin/_components/AdminDrawer';
import AdminSidebar, { AdminSidebarNav } from '@/app/admin/_components/AdminSidebar';

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

  const openNavDrawer = () => setNavDrawerOpen(true);
  const closeNavDrawer = () => setNavDrawerOpen(false);

  return (
    <>
      <div className="flex min-h-screen flex-col lg:flex-row">
        {!sidebarCollapsed && (
          <div className="hidden lg:block">
            <AdminSidebar
              adminName={adminName}
              logoutAction={logoutAction}
              onCollapse={() => setSidebarCollapsed(true)}
            />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-admin-border bg-admin-surface/95 px-4 py-3 backdrop-blur lg:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={openNavDrawer}
                className="rounded-full border border-admin-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-admin-muted transition hover:border-admin-gold/50 lg:hidden"
              >
                Menu
              </button>
              {sidebarCollapsed && (
                <button
                  type="button"
                  onClick={openNavDrawer}
                  className="hidden rounded-full border border-admin-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-admin-muted transition hover:border-admin-gold/50 lg:inline-flex"
                >
                  Open menu
                </button>
              )}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-admin-gold">
                  Rasoi Console
                </p>
                <p className="text-sm font-medium text-admin-ink">Admin workspace</p>
              </div>
            </div>
            <p className="hidden text-sm text-admin-muted sm:block">{adminName}</p>
          </header>

          <div className="flex-1 overflow-auto">
            <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</main>
          </div>
        </div>
      </div>

      <AdminDrawer
        open={navDrawerOpen}
        onClose={closeNavDrawer}
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
            onNavigate={closeNavDrawer}
          />
        </aside>
      </AdminDrawer>
    </>
  );
}
