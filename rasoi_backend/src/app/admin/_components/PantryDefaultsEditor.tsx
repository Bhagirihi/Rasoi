'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { setDefaultPantryIngredientsAction } from '@/app/admin/pantry-defaults-actions';
import { useToast } from '@/app/admin/_components/Toast';
import { GhostButton } from '@/app/admin/_components/ui';
import type { PantryIngredientCatalogRow } from '@/lib/pantry-ingredients-catalog';

type SectionGroup = {
  section: string;
  items: PantryIngredientCatalogRow[];
};

type FilterMode = 'all' | 'staples' | 'selected';

export default function PantryDefaultsEditor({
  catalog,
  initialSelected,
}: {
  catalog: PantryIngredientCatalogRow[];
  initialSelected: string[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initialSelected));
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterMode>('all');
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const grouped = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const map = new Map<string, PantryIngredientCatalogRow[]>();

    for (const row of catalog) {
      if (filter === 'staples' && !row.isStaple) continue;
      if (filter === 'selected' && !selected.has(row.name)) continue;
      if (needle && !row.name.toLowerCase().includes(needle)) continue;

      const bucket = map.get(row.section) ?? [];
      bucket.push(row);
      map.set(row.section, bucket);
    }

    const sections: SectionGroup[] = [...map.entries()].map(([section, items]) => ({
      section,
      items: items.sort((a, b) => a.name.localeCompare(b.name)),
    }));

    return sections;
  }, [catalog, filter, search, selected]);

  const visibleCount = grouped.reduce((sum, group) => sum + group.items.length, 0);

  const toggleItem = (name: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const selectSection = (items: PantryIngredientCatalogRow[]) => {
    setSelected((current) => {
      const next = new Set(current);
      for (const item of items) next.add(item.name);
      return next;
    });
  };

  const clearSection = (items: PantryIngredientCatalogRow[]) => {
    setSelected((current) => {
      const next = new Set(current);
      for (const item of items) next.delete(item.name);
      return next;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const ingredients = [...selected].sort((a, b) => a.localeCompare(b));
      await setDefaultPantryIngredientsAction(ingredients);
      toast.success(`Saved ${ingredients.length} default pantry item${ingredients.length === 1 ? '' : 's'}.`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save default pantry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search ingredients…"
          className="min-w-[220px] flex-1 rounded-full border border-admin-border bg-white px-4 py-2.5 text-sm text-admin-ink outline-none ring-admin-gold/30 focus:ring-2"
        />
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['all', 'All'],
              ['staples', 'Staples only'],
              ['selected', 'Selected'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                filter === value
                  ? 'border-admin-gold/50 bg-admin-gold/10 text-admin-ink'
                  : 'border-admin-border text-admin-muted hover:border-admin-gold/30'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-admin-border bg-[#faf8f4] px-4 py-3">
        <p className="text-sm text-admin-muted">
          <span className="font-semibold text-admin-ink">{selected.size}</span> default items ·{' '}
          {visibleCount} shown · {catalog.length} total in catalog
        </p>
        <GhostButton type="button" disabled={loading} onClick={() => void handleSave()}>
          {loading ? 'Saving…' : 'Save defaults'}
        </GhostButton>
      </div>

      <div className="space-y-4">
        {grouped.length === 0 ? (
          <p className="rounded-[1.25rem] border border-dashed border-admin-border px-4 py-8 text-center text-sm text-admin-muted">
            No ingredients match your search.
          </p>
        ) : (
          grouped.map((group) => {
            const sectionSelected = group.items.filter((item) => selected.has(item.name)).length;
            const isCollapsed = collapsed[group.section] ?? group.section === 'Other';

            return (
              <section
                key={group.section}
                className="overflow-hidden rounded-[1.25rem] border border-admin-border bg-white"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-admin-border px-4 py-3">
                  <button
                    type="button"
                    onClick={() =>
                      setCollapsed((current) => ({
                        ...current,
                        [group.section]: !isCollapsed,
                      }))
                    }
                    className="text-left"
                  >
                    <p className="text-sm font-semibold text-admin-ink">{group.section}</p>
                    <p className="text-xs text-admin-muted">
                      {sectionSelected}/{group.items.length} marked default
                    </p>
                  </button>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => selectSection(group.items)}
                      className="text-xs font-semibold text-admin-gold-soft hover:text-admin-gold"
                    >
                      Select section
                    </button>
                    <button
                      type="button"
                      onClick={() => clearSection(group.items)}
                      className="text-xs font-semibold text-admin-muted hover:text-admin-ink"
                    >
                      Clear section
                    </button>
                  </div>
                </div>

                {!isCollapsed ? (
                  <ul className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-3">
                    {group.items.map((item) => {
                      const checked = selected.has(item.name);
                      return (
                        <li key={item.name}>
                          <label
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 transition ${
                              checked
                                ? 'border-emerald-300 bg-emerald-50/80'
                                : 'border-admin-border hover:border-admin-gold/30'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleItem(item.name)}
                              className="mt-0.5 h-4 w-4 rounded border-admin-border text-emerald-600"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-semibold text-admin-ink">{item.name}</span>
                              <span className="mt-0.5 block text-[11px] text-admin-muted">
                                {item.recipeCount} recipe{item.recipeCount === 1 ? '' : 's'}
                                {item.isStaple ? ' · staple' : ''}
                              </span>
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
