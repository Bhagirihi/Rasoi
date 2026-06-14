'use client';

import FilterChipBar from '@/app/admin/_components/FilterChipBar';
import {
  DIET_CHOICE_LABELS,
  DIET_CHOICES,
  FAST_FILTER_TAGS,
  RECIPE_DIFFICULTIES,
  REGIONAL_CUISINES,
} from '@/lib/recipe-filters';

const DIET_DOT_COLORS: Record<string, string> = {
  Veg: '#00a86b',
  Egg: '#f4c430',
  'Non-Veg': '#e53935',
  Jain: '#ff9933',
};

export default function RecipeFilterPanel() {
  return (
    <div className="admin-card space-y-5 rounded-[1.25rem] p-5">
      <FilterChipBar
        param="dietChoice"
        label="Diet (matches mobile app)"
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
        label="Region"
        options={[
          { value: 'all', label: 'All India' },
          ...REGIONAL_CUISINES.filter((r) => r !== 'All India').map((region) => ({
            value: region,
            label: region,
          })),
        ]}
      />

      <FilterChipBar
        param="tag"
        label="Quick filters"
        options={[
          { value: 'all', label: 'All recipes' },
          ...FAST_FILTER_TAGS.map((tag) => ({
            value: tag,
            label:
              tag === 'under20'
                ? 'Under 20 min'
                : tag === 'leftover'
                  ? 'Leftover makeover'
                  : 'Kids favourites',
          })),
        ]}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <FilterChipBar
          param="difficulty"
          label="Difficulty"
          options={[
            { value: 'all', label: 'Any' },
            ...RECIPE_DIFFICULTIES.map((level) => ({ value: level, label: level })),
          ]}
        />

        <FilterChipBar
          param="published"
          label="Status"
          defaultValue="all"
          options={[
            { value: 'all', label: 'All' },
            { value: 'published', label: 'Published' },
            { value: 'draft', label: 'Draft' },
          ]}
        />
      </div>
    </div>
  );
}
