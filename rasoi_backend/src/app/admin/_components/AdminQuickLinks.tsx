import Link from 'next/link';

import { adminNavSections } from '@/app/admin/_components/admin-nav';
import { AdminCard } from '@/app/admin/_components/ui';

export default function AdminQuickLinks() {
  const sections = adminNavSections.filter((section) => section.id !== 'dashboard');

  return (
    <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
      {sections.map((section) => (
        <AdminCard key={section.id} className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
            {section.label}
          </p>
          <ul className="mt-4 space-y-2">
            {section.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group block rounded-xl border border-transparent px-3 py-2.5 transition hover:border-admin-border hover:bg-[#f7f2ea]"
                >
                  <p className="text-sm font-semibold text-admin-ink group-hover:text-admin-saffron">
                    {item.label}
                  </p>
                  {item.shortDescription ? (
                    <p className="mt-0.5 text-xs leading-relaxed text-admin-muted">
                      {item.shortDescription}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </AdminCard>
      ))}
    </div>
  );
}
