import Link from 'next/link';

type TablePaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  buildHref: (page: number) => string;
};

export function TablePagination({ page, pageSize, total, buildHref }: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, total);

  if (total <= pageSize) {
    return (
      <p className="text-sm text-admin-muted">
        {total === 0 ? 'No results' : `Showing all ${total}`}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-admin-border/80 px-5 py-4">
      <p className="text-sm text-admin-muted">
        Showing {start}–{end} of {total}
      </p>
      <div className="flex items-center gap-2">
        {safePage > 1 ? (
          <Link
            href={buildHref(safePage - 1)}
            className="rounded-lg border border-admin-border px-3 py-1.5 text-sm font-semibold text-admin-ink transition hover:bg-[#f7f2ea]"
          >
            Previous
          </Link>
        ) : (
          <span className="rounded-lg border border-admin-border/50 px-3 py-1.5 text-sm text-admin-muted">
            Previous
          </span>
        )}
        <span className="px-2 text-sm text-admin-muted">
          Page {safePage} of {totalPages}
        </span>
        {safePage < totalPages ? (
          <Link
            href={buildHref(safePage + 1)}
            className="rounded-lg border border-admin-border px-3 py-1.5 text-sm font-semibold text-admin-ink transition hover:bg-[#f7f2ea]"
          >
            Next
          </Link>
        ) : (
          <span className="rounded-lg border border-admin-border/50 px-3 py-1.5 text-sm text-admin-muted">
            Next
          </span>
        )}
      </div>
    </div>
  );
}

function buildQueryString(
  params: Record<string, string | string[] | undefined>,
  overrides: Record<string, string | number | undefined>,
): string {
  const merged = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      if (value[0]) merged.set(key, value[0]);
    } else if (value) {
      merged.set(key, value);
    }
  }

  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined || value === '') {
      merged.delete(key);
      continue;
    }
    merged.set(key, String(value));
  }

  const query = merged.toString();
  return query ? `?${query}` : '';
}

export function buildAdminPageHref(
  basePath: string,
  searchParams: Record<string, string | string[] | undefined>,
  page: number,
): string {
  return `${basePath}${buildQueryString(searchParams, { page: page <= 1 ? undefined : String(page) })}`;
}
