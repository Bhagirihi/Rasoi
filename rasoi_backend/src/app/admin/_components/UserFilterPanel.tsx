'use client';

import FilterChipBar from '@/app/admin/_components/FilterChipBar';
import {
  DIET_CHOICE_LABELS,
  DIET_CHOICES,
  REGIONAL_CUISINES,
} from '@/lib/recipe-filters';

const DIET_DOT_COLORS: Record<string, string> = {
  Veg: '#00a86b',
  Egg: '#f4c430',
  'Non-Veg': '#e53935',
  Jain: '#ff9933',
};

export default function UserFilterPanel() {
  return (
    <div className="admin-card space-y-5 rounded-[1.25rem] p-5">
      <FilterChipBar
        param="dietChoice"
        label="Diet preference"
        options={[
          { value: 'all', label: 'All diets' },
          ...DIET_CHOICES.map((choice) => ({
            value: choice,
            label: DIET_CHOICE_LABELS[choice],
            dotColor: DIET_DOT_COLORS[choice],
          })),
        ]}
      />

      <FilterChipBar
        param="region"
        label="Regional cuisine"
        options={[
          { value: 'all', label: 'All India' },
          ...REGIONAL_CUISINES.filter((r) => r !== 'All India').map((region) => ({
            value: region,
            label: region,
          })),
        ]}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <FilterChipBar
          param="memberType"
          label="Account type"
          options={[
            { value: 'all', label: 'Everyone' },
            { value: 'member', label: 'Members' },
            { value: 'guest', label: 'Guests' },
          ]}
        />

        <FilterChipBar
          param="plan"
          label="Plan"
          options={[
            { value: 'all', label: 'All plans' },
            { value: 'free', label: 'Free' },
            { value: 'trial', label: 'Trial' },
            { value: 'paid', label: 'Rasoi Plus' },
          ]}
        />
      </div>
    </div>
  );
}
