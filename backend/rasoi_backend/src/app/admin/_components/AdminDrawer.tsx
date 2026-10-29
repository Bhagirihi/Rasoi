'use client';

import { useEffect, type ReactNode } from 'react';

type AdminDrawerProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  onClose: () => void;
  children: ReactNode;
  side?: 'left' | 'right';
  tone?: 'light' | 'dark';
  hideHeader?: boolean;
};

export default function AdminDrawer({
  open,
  title,
  subtitle,
  eyebrow = 'Details',
  onClose,
  children,
  side = 'right',
  tone = 'light',
  hideHeader = false,
}: AdminDrawerProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const isLeft = side === 'left';
  const isDark = tone === 'dark';

  return (
    <div className={`fixed inset-0 z-50 flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
      <button
        type="button"
        aria-label="Close drawer"
        className="absolute inset-0 bg-[#0a0908]/45 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <aside
        className={`relative flex h-full w-full flex-col shadow-2xl ${
          isLeft
            ? `max-w-[17.5rem] border-r ${isDark ? 'admin-sidebar-grain border-[#2a2218] text-admin-cream' : 'border-admin-border bg-admin-surface'}`
            : `max-w-lg border-l ${isDark ? 'admin-sidebar-grain border-[#2a2218] text-admin-cream' : 'border-admin-border bg-admin-surface'}`
        }`}
      >
        {!hideHeader && (
          <div
            className={`border-b px-6 py-5 ${isDark ? 'border-[#2a2218]' : 'border-admin-border'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                    isDark ? 'text-admin-sidebar-muted' : 'text-admin-gold'
                  }`}
                >
                  {eyebrow}
                </p>
                <h2
                  className={`font-display mt-1 text-2xl font-semibold ${
                    isDark ? 'text-white' : 'text-admin-ink'
                  }`}
                >
                  {title}
                </h2>
                {subtitle && (
                  <p className={`mt-1 text-sm ${isDark ? 'text-[#d8d0c6]' : 'text-admin-muted'}`}>
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                  isDark
                    ? 'border-[#3a312a] text-[#d8d0c6] hover:border-admin-gold/40 hover:text-admin-gold-soft'
                    : 'border-admin-border text-admin-muted hover:border-admin-gold/50'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className={`flex-1 overflow-y-auto ${hideHeader ? '' : 'px-6 py-5'}`}>{children}</div>
      </aside>
    </div>
  );
}
