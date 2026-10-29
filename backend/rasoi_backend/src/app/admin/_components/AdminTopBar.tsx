'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  findActiveAdminNav,
  nestedAdminPageLabel,
} from '@/app/admin/_components/admin-nav';

export default function AdminTopBar({
  adminName,
  sidebarCollapsed,
  onOpenNavDrawer,
  onExpandSidebar,
}: {
  adminName: string;
  sidebarCollapsed: boolean;
  onOpenNavDrawer: () => void;
  onExpandSidebar: () => void;
}) {
  const pathname = usePathname();
  const active = findActiveAdminNav(pathname);

  const sectionLabel = active?.section.label ?? 'Rasoi Console';
  const pageLabel = active?.item.label ?? 'Admin workspace';
  const nestedLabel = active?.isNested ? nestedAdminPageLabel(pathname) : null;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-admin-border bg-admin-surface/95 px-4 py-3 backdrop-blur lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenNavDrawer}
          className="shrink-0 rounded-full border border-admin-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-admin-muted transition hover:border-admin-gold/50 lg:hidden"
        >
          Menu
        </button>
        {sidebarCollapsed ? (
          <button
            type="button"
            onClick={onExpandSidebar}
            className="hidden shrink-0 rounded-full border border-admin-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-admin-muted transition hover:border-admin-gold/50 lg:inline-flex"
          >
            Show sidebar
          </button>
        ) : null}
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-admin-gold">
            {sectionLabel}
          </p>
          <p className="truncate text-sm font-medium text-admin-ink">
            {active?.isNested ? (
              <>
                <Link href={active.item.href} className="transition hover:text-admin-saffron">
                  {pageLabel}
                </Link>
                <span className="text-admin-muted"> / {nestedLabel}</span>
              </>
            ) : (
              pageLabel
            )}
          </p>
        </div>
      </div>
      <p className="hidden shrink-0 text-sm text-admin-muted sm:block">{adminName}</p>
    </header>
  );
}
