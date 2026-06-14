'use client';

import FilterChipBar from '@/app/admin/_components/FilterChipBar';

export default function SponsorApplicationFilterPanel() {
  return (
    <div className="admin-card space-y-5 rounded-[1.25rem] p-5">
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
          { value: 'home', label: 'Home' },
          { value: 'pantry', label: 'Pantry' },
          { value: 'recipe', label: 'In-recipe' },
          { value: 'multiple', label: 'Multiple' },
        ]}
      />
    </div>
  );
}
