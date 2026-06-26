'use client';

import FilterChipBar from '@/app/admin/_components/FilterChipBar';
import AdminFilterShell from '@/app/admin/_components/AdminFilterShell';
import { SPONSOR_APPLICATION_PLACEMENT_OPTIONS } from '@/lib/sponsor-placements';

export default function SponsorApplicationFilterPanel() {
  return (
    <AdminFilterShell>
      <FilterChipBar
        param="status"
        label="Status"
        options={[
          { value: 'all', label: 'All' },
          { value: 'pending', label: 'Pending' },
          { value: 'reviewed', label: 'Reviewed' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
        ]}
      />

      <FilterChipBar
        param="placement"
        label="Placement interest"
        options={[
          { value: 'all', label: 'All placements' },
          ...SPONSOR_APPLICATION_PLACEMENT_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          })),
        ]}
      />
    </AdminFilterShell>
  );
}
