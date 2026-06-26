import { formatAdminDateTime } from '@/app/admin/_components/admin-datetime';
import { DataTable } from '@/app/admin/_components/DataTable';
import { Badge } from '@/app/admin/_components/ui';
import type { AffiliateEventListItem } from '@/lib/affiliate-event-stats';

const contextTone: Record<string, 'gold' | 'neutral' | 'success' | 'warning'> = {
  sponsor_rail: 'gold',
  brand_search: 'neutral',
  grocery_checkout: 'success',
  food_delivery: 'warning',
};

const contextLabel: Record<string, string> = {
  sponsor_rail: 'Sponsor rail',
  brand_search: 'Brand search',
  grocery_checkout: 'Grocery checkout',
  food_delivery: 'Food delivery',
};

export default function AffiliateEventsTable({ items }: { items: AffiliateEventListItem[] }) {
  return (
    <DataTable
      columns={['Partner', 'Context', 'Query', 'User', 'Location', 'When']}
      emptyMessage="No partner checkout events yet."
    >
      {items.map((item) => (
        <tr key={item.id} className="align-top transition hover:bg-[#f7f2ea]">
          <td className="px-5 py-4">
            <Badge tone="gold">{item.partner}</Badge>
          </td>
          <td className="px-5 py-4">
            <Badge tone={contextTone[item.context ?? ''] ?? 'neutral'}>
              {contextLabel[item.context ?? ''] ?? item.context ?? '—'}
            </Badge>
          </td>
          <td className="px-5 py-4">
            <p className="max-w-xs text-sm leading-relaxed text-admin-ink">{item.query ?? '—'}</p>
            {item.recipeId && (
              <p className="mt-1 text-xs text-admin-muted">Recipe: {item.recipeId}</p>
            )}
          </td>
          <td className="px-5 py-4 text-sm text-admin-muted">
            <p className="font-medium text-admin-ink">{item.user?.name ?? 'Guest'}</p>
            {item.user?.phone && <p className="mt-1 text-xs">+91 {item.user.phone}</p>}
            {item.user?.email && <p className="mt-1 text-xs">{item.user.email}</p>}
          </td>
          <td className="px-5 py-4 text-sm text-admin-muted">
            {item.user?.city
              ? `${item.user.city}${item.user.state ? `, ${item.user.state}` : ''}`
              : '—'}
          </td>
          <td className="px-5 py-4 text-sm text-admin-muted">
            {formatAdminDateTime(item.createdAt)}
          </td>
        </tr>
      ))}
    </DataTable>
  );
}
