import Link from 'next/link';

export default function StatCard({
  label,
  value,
  href,
  hint,
}: {
  label: string;
  value: number | string;
  href: string;
  hint?: string;
}) {
  return (
    <Link
      href={href}
      className="admin-card group rounded-[1.25rem] p-6 transition hover:-translate-y-0.5 hover:border-admin-gold/40"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
        {label}
      </p>
      <p className="font-display mt-3 text-4xl font-semibold text-admin-ink">{value}</p>
      {hint && (
        <p className="mt-3 text-sm text-admin-muted transition group-hover:text-admin-saffron">
          {hint}
        </p>
      )}
    </Link>
  );
}
