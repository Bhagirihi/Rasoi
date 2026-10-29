import Link from 'next/link';
import type { ReactNode } from 'react';

export function AdminCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`admin-card rounded-[1.25rem] ${className}`}>{children}</div>
  );
}

export function PageHeader({
  title,
  description,
  action,
  section,
  backHref,
  backLabel,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  /** Sidebar section label — auto from pathname when omitted on client pages */
  section?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-admin-border pb-6">
      <div className="min-w-0 flex-1">
        {backHref ? (
          <Link
            href={backHref}
            className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-admin-saffron transition hover:text-admin-ink"
          >
            <span aria-hidden>←</span>
            {backLabel ?? 'Back'}
          </Link>
        ) : null}
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-admin-gold">
          {section ?? 'Rasoi Console'}
        </p>
        <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight text-admin-ink">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-admin-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function PrimaryButton({
  children,
  href,
  type = 'button',
  disabled,
  onClick,
  className = '',
}: {
  children: ReactNode;
  href?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const styles =
    `inline-flex items-center justify-center rounded-full border border-admin-gold/40 bg-admin-sidebar px-5 py-2.5 text-sm font-semibold tracking-wide text-admin-cream transition hover:border-admin-gold hover:bg-[#1c1714] disabled:opacity-50 ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={styles}>
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  href,
  type = 'button',
  disabled,
  onClick,
  className = '',
}: {
  children: ReactNode;
  href?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const styles =
    `inline-flex items-center justify-center rounded-full border border-admin-border bg-transparent px-4 py-2 text-sm font-medium text-admin-ink transition hover:border-admin-gold/60 hover:bg-white/60 disabled:opacity-50 ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={styles}>
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'gold' | 'success' | 'warning';
}) {
  const tones = {
    neutral: 'bg-[#ece5da] text-admin-muted',
    gold: 'bg-[#efe4c8] text-[#7a5d16]',
    success: 'bg-[#e2f0e8] text-[#2f6b4f]',
    warning: 'bg-[#f8e8dc] text-[#9a4d28]',
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
      {children}
    </span>
  );
}

export function TextInput({
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
  className = '',
}: {
  value: string | number;
  onChange?: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      required={required}
      placeholder={placeholder}
      className={`mt-2 w-full rounded-xl border border-admin-border bg-white/80 px-4 py-3 text-sm text-admin-ink outline-none transition placeholder:text-admin-muted/70 focus:border-admin-gold/70 focus:ring-2 focus:ring-admin-gold/15 ${className}`}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 4,
  required,
  placeholder,
  className = '',
}: {
  value: string;
  onChange?: (value: string) => void;
  rows?: number;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      rows={rows}
      required={required}
      placeholder={placeholder}
      className={`mt-2 w-full rounded-xl border border-admin-border bg-white/80 px-4 py-3 text-sm text-admin-ink outline-none transition placeholder:text-admin-muted/70 focus:border-admin-gold/70 focus:ring-2 focus:ring-admin-gold/15 ${className}`}
    />
  );
}

export function SelectInput({
  value,
  onChange,
  options,
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[] | ReadonlyArray<{ value: string; label: string }>;
  className?: string;
}) {
  const normalized = options.map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  );

  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`mt-2 w-full rounded-xl border border-admin-border bg-white/80 px-4 py-3 text-sm text-admin-ink outline-none transition focus:border-admin-gold/70 focus:ring-2 focus:ring-admin-gold/15 ${className}`}
    >
      {normalized.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
