'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import RasoiLogo from '@/app/_components/RasoiLogo';
import { adminNavSections } from '@/app/admin/_components/admin-nav';
import { useToast } from '@/app/admin/_components/Toast';

export { adminNavItems, adminNavSections } from '@/app/admin/_components/admin-nav';

export function AdminSidebarNav({
  adminName,
  logoutAction,
  onNavigate,
  showCollapse,
  onCollapse,
}: {
  adminName: string;
  logoutAction: () => Promise<void>;
  onNavigate?: () => void;
  showCollapse?: boolean;
  onCollapse?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();

  return (
    <>
      <div className="border-b border-[#2a2218] px-6 py-8">
        <div className="flex items-center justify-between gap-3">
          <Link href="/admin" onClick={onNavigate} className="flex items-center gap-3">
            <RasoiLogo size="md" />
            <div>
              <p className="font-display text-2xl font-semibold tracking-tight">Rasoi</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-admin-sidebar-muted">
                Admin Studio
              </p>
            </div>
          </Link>
          {showCollapse && onCollapse ? (
            <button
              type="button"
              onClick={onCollapse}
              aria-label="Collapse sidebar"
              className="rounded-full border border-[#3a312a] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#d8d0c6] transition hover:border-admin-gold/40 hover:text-admin-gold-soft"
            >
              Hide
            </button>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-6">
          {adminNavSections.map((section) => (
            <div key={section.id}>
              <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-admin-sidebar-muted">
                {section.label}
              </p>
              <ul className="mt-2 space-y-1">
                {section.items.map((item) => {
                  const active =
                    item.exact === true
                      ? pathname === item.href
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        title={item.shortDescription}
                        className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                          active
                            ? 'border border-admin-gold/30 bg-[#221c18] text-admin-gold-soft'
                            : 'text-[#d8d0c6] hover:bg-[#1c1714] hover:text-white'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="border-t border-[#2a2218] px-6 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-admin-sidebar-muted">
          Signed in
        </p>
        <p className="mt-2 text-sm font-medium text-white">{adminName}</p>
        <form
          className="mt-4"
          onSubmit={(event) => {
            event.preventDefault();
            void logoutAction().then(() => {
              toast.info('Signed out.');
              router.push('/admin/login');
              router.refresh();
            });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-full border border-[#3a312a] px-4 py-2 text-sm font-medium text-[#d8d0c6] transition hover:border-admin-gold/40 hover:text-admin-gold-soft"
          >
            Sign out
          </button>
        </form>
      </div>
    </>
  );
}

export default function AdminSidebar({
  adminName,
  logoutAction,
  onCollapse,
}: {
  adminName: string;
  logoutAction: () => Promise<void>;
  onCollapse?: () => void;
}) {
  return (
    <aside className="admin-sidebar-grain flex h-full w-[17.5rem] shrink-0 flex-col border-r border-[#2a2218] text-admin-cream">
      <AdminSidebarNav
        adminName={adminName}
        logoutAction={logoutAction}
        showCollapse={Boolean(onCollapse)}
        onCollapse={onCollapse}
      />
    </aside>
  );
}
