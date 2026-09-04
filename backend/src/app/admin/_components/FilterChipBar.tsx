'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export type FilterChipOption = {
  value: string;
  label: string;
  dotColor?: string;
};

export default function FilterChipBar({
  param,
  label,
  options,
  defaultValue = 'all',
}: {
  param: string;
  label: string;
  options: FilterChipOption[];
  defaultValue?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get(param) ?? defaultValue;

  const setValue = (value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value === defaultValue) {
      next.delete(param);
    } else {
      next.set(param, value);
    }
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = active === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue(option.value)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                isActive
                  ? 'border-admin-gold/50 bg-[#f0e9de] text-admin-ink'
                  : 'border-admin-border bg-white/70 text-admin-muted hover:border-admin-gold/30'
              }`}
            >
              {option.dotColor && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: option.dotColor }}
                />
              )}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
