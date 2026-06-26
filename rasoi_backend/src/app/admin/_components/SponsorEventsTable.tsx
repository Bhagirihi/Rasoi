import { formatAdminDateTime } from '@/app/admin/_components/admin-datetime';
import { DataTable } from '@/app/admin/_components/DataTable';
import { Badge } from '@/app/admin/_components/ui';
import type { SponsorEventListItem } from '@/lib/sponsor-analytics';

export default function SponsorEventsTable({
  items,
  emptyMessage = 'No sponsor analytics events yet.',
}: {
  items: SponsorEventListItem[];
  emptyMessage?: string;
}) {
  return (
    <DataTable
      columns={['Type', 'Brand', 'Placement', 'User', 'City', 'When']}
      emptyMessage={emptyMessage}
    >
      {items.map((item) => (
        <tr key={item.id} className="align-top transition hover:bg-[#f7f2ea]">
          <td className="px-5 py-4">
            <Badge tone={item.eventType === 'tap' ? 'gold' : 'neutral'}>{item.eventType}</Badge>
          </td>
          <td className="px-5 py-4 text-sm font-medium text-admin-ink">{item.brandName}</td>
          <td className="px-5 py-4">
            <Badge tone="success">{item.placement}</Badge>
          </td>
          <td className="px-5 py-4 text-sm text-admin-muted">
            {item.user?.name ?? 'Guest'}
          </td>
          <td className="px-5 py-4 text-sm text-admin-muted">
            {item.city ?? item.user?.city ?? '—'}
          </td>
          <td className="px-5 py-4 text-sm text-admin-muted">
            {formatAdminDateTime(item.createdAt)}
          </td>
        </tr>
      ))}
    </DataTable>
  );
}
