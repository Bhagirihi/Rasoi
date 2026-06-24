import PantryDefaultsEditor from '@/app/admin/_components/PantryDefaultsEditor';
import { AdminCard, PageHeader } from '@/app/admin/_components/ui';
import { getAppConfig } from '@/lib/app-settings';
import { groupIngredientsBySection, listRecipeIngredientCatalog } from '@/lib/pantry-ingredients-catalog';

export default async function AdminPantryDefaultsPage() {
  const [catalog, appConfig] = await Promise.all([
    listRecipeIngredientCatalog(),
    getAppConfig(),
  ]);

  const sectionCount = groupIngredientsBySection(catalog).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pantry defaults"
        description="Choose which ingredients new users already have at home. Checked items are pre-stocked when someone registers or starts as a guest."
      />

      <AdminCard className="p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
          How it works
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-admin-muted">
          <li>Ingredients come from every recipe in the catalog ({catalog.length} unique names).</li>
          <li>Checked items are saved to App Settings and applied to new accounts only.</li>
          <li>Existing users keep their own pantry — this does not overwrite them.</li>
          <li>Currently {appConfig.defaultPantryIngredients.length} default item
            {appConfig.defaultPantryIngredients.length === 1 ? '' : 's'} across {sectionCount} sections.
          </li>
        </ul>
      </AdminCard>

      <AdminCard className="p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
          Default pantry checklist
        </p>
        <div className="mt-5">
          <PantryDefaultsEditor
            catalog={catalog}
            initialSelected={appConfig.defaultPantryIngredients}
          />
        </div>
      </AdminCard>
    </div>
  );
}
