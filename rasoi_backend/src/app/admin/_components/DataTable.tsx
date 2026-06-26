import { Children, type ReactNode } from 'react';

export function DataTable({
  columns,
  children,
  emptyMessage,
  footer,
}: {
  columns: string[];
  children: ReactNode;
  emptyMessage?: string;
  footer?: ReactNode;
}) {
  const isEmpty = Children.count(children) === 0;

  return (
    <div className="admin-card overflow-hidden rounded-[1.25rem]">
      <div className="overflow-x-auto">
        <table className="admin-table min-w-full text-left text-sm">
          <thead className="bg-[#f0e9de] text-[11px] font-semibold uppercase tracking-[0.16em] text-admin-muted">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-5 py-4">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border/80 bg-admin-surface">
            {isEmpty ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-sm text-admin-muted"
                >
                  {emptyMessage ?? 'No records found.'}
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
      {footer && !isEmpty ? (
        <div className="border-t border-admin-border/80 bg-[#f7f2ea] px-5 py-3 text-xs text-admin-muted">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
