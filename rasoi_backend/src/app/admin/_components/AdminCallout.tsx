import type { ReactNode } from 'react';

type AdminCalloutTone = 'info' | 'tip' | 'warning';

const toneStyles: Record<AdminCalloutTone, string> = {
  info: 'border-admin-border bg-[#f7f2ea] text-admin-muted',
  tip: 'border-admin-gold/30 bg-[#faf5e8] text-admin-muted',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-950',
};

export default function AdminCallout({
  children,
  tone = 'info',
}: {
  children: ReactNode;
  tone?: AdminCalloutTone;
}) {
  return (
    <div className={`admin-callout rounded-[1.25rem] border px-4 py-3 text-sm leading-relaxed ${toneStyles[tone]}`}>
      {children}
    </div>
  );
}
