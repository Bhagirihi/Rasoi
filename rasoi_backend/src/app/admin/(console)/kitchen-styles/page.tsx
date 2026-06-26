import Link from 'next/link';

import ConfirmDeleteForm from '@/app/admin/_components/ConfirmDeleteForm';
import AdminPageHeader from '@/app/admin/_components/AdminPageHeader';
import AdminPageLayout from '@/app/admin/_components/AdminPageLayout';
import { DataTable } from '@/app/admin/_components/DataTable';
import KitchenStyleStatusToggle from '@/app/admin/(console)/kitchen-styles/KitchenStyleStatusToggle';
import { Badge, PrimaryButton } from '@/app/admin/_components/ui';
import { deleteKitchenStyleAction } from '@/app/admin/kitchen-style-actions';
import { getAllKitchenStyles } from '@/lib/kitchen-styles';

export default async function AdminKitchenStylesPage() {
  const styles = await getAllKitchenStyles();

  return (
    <AdminPageLayout>
      <AdminPageHeader
        href="/admin/kitchen-styles"
        description="Manage cuisine vibes shown during onboarding and in settings. Disabled styles are hidden from the app."
        action={<PrimaryButton href="/admin/kitchen-styles/new">Add style</PrimaryButton>}
      />

      <DataTable
        columns={['Style', 'Region', 'Mood', 'Order', 'Status', 'Actions']}
        emptyMessage="No kitchen styles configured."
        footer={`${styles.length} style${styles.length === 1 ? '' : 's'}`}
      >
        {styles.map((style) => (
          <tr key={style.id} className="transition hover:bg-[#f7f2ea]">
            <td className="px-5 py-4">
              <p className="font-medium text-admin-ink">{style.label}</p>
              <p className="mt-1 text-xs text-admin-muted">{style.id}</p>
            </td>
            <td className="px-5 py-4">
              <Badge tone="gold">{style.region}</Badge>
            </td>
            <td className="px-5 py-4 text-admin-muted">{style.mood}</td>
            <td className="px-5 py-4 text-admin-muted">{style.sortOrder}</td>
            <td className="px-5 py-4">
              <KitchenStyleStatusToggle
                id={style.id}
                label={style.label}
                active={style.active}
              />
            </td>
            <td className="px-5 py-4">
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/kitchen-styles/${style.id}`}
                  className="text-sm font-semibold text-admin-saffron hover:text-admin-ink"
                >
                  Edit
                </Link>
                <ConfirmDeleteForm
                  action={deleteKitchenStyleAction.bind(null, style.id)}
                  confirmMessage={`Delete kitchen style "${style.label}"?`}
                  successMessage={`Deleted kitchen style "${style.label}".`}
                >
                  <button
                    type="submit"
                    className="text-sm font-medium text-red-700/80 hover:text-red-700"
                  >
                    Delete
                  </button>
                </ConfirmDeleteForm>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </AdminPageLayout>
  );
}
