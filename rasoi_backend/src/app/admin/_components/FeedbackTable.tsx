import { formatAdminDate } from '@/app/admin/_components/admin-datetime';
import ConfirmDeleteForm from '@/app/admin/_components/ConfirmDeleteForm';
import { DataTable } from '@/app/admin/_components/DataTable';
import FeedbackStatusButton from '@/app/admin/_components/FeedbackStatusButton';
import { Badge } from '@/app/admin/_components/ui';
import { deleteFeedbackAction } from '@/app/admin/feedback-actions';
import type { FeedbackListItem } from '@/lib/feedback-stats';

const categoryTone = {
  issue: 'neutral',
  suggestion: 'gold',
  other: 'warning',
} as const;

const statusTone = {
  pending: 'warning',
  reviewed: 'gold',
  resolved: 'success',
} as const;

const categoryLabel = {
  issue: 'Issue',
  suggestion: 'Suggestion',
  other: 'Other',
} as const;

export default function FeedbackTable({ items }: { items: FeedbackListItem[] }) {
  return (
    <DataTable
      columns={['Type', 'Message', 'From', 'App', 'Status', 'Submitted', 'Actions']}
      emptyMessage="No feedback yet."
    >
      {items.map((item) => (
        <tr key={item.id} className="align-top transition hover:bg-[#f7f2ea]">
          <td className="px-5 py-4">
            <Badge tone={categoryTone[item.category as keyof typeof categoryTone] ?? 'neutral'}>
              {categoryLabel[item.category as keyof typeof categoryLabel] ?? item.category}
            </Badge>
          </td>
          <td className="px-5 py-4">
            <p className="max-w-md text-sm leading-relaxed text-admin-ink">{item.message}</p>
          </td>
          <td className="px-5 py-4 text-sm text-admin-muted">
            <p className="font-medium text-admin-ink">{item.name ?? item.user?.name ?? 'Anonymous'}</p>
            {(item.email ?? item.user?.email) && (
              <p className="mt-1 text-xs">{item.email ?? item.user?.email}</p>
            )}
            {item.user?.phone && <p className="mt-1 text-xs">+91 {item.user.phone}</p>}
          </td>
          <td className="px-5 py-4 text-xs text-admin-muted">
            {item.platform ?? '—'}
            {item.appVersion ? ` · v${item.appVersion}` : ''}
          </td>
          <td className="px-5 py-4">
            <Badge tone={statusTone[item.status as keyof typeof statusTone] ?? 'neutral'}>
              {item.status}
            </Badge>
          </td>
          <td className="px-5 py-4 text-sm text-admin-muted">
            {formatAdminDate(item.createdAt)}
          </td>
          <td className="px-5 py-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <FeedbackStatusButton feedbackId={item.id} status="reviewed" />
                <FeedbackStatusButton feedbackId={item.id} status="resolved" />
              </div>
              <ConfirmDeleteForm
                action={deleteFeedbackAction.bind(null, item.id)}
                confirmMessage="Delete this feedback entry?"
                successMessage="Feedback deleted."
              >
                <button type="submit" className="text-xs font-medium text-red-700/80 hover:text-red-700">
                  Delete
                </button>
              </ConfirmDeleteForm>
            </div>
          </td>
        </tr>
      ))}
    </DataTable>
  );
}
