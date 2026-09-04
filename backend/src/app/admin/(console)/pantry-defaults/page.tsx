import PantryDefaultsEditor from '@/app/admin/_components/PantryDefaultsEditor';
import AdminPageHeader from '@/app/admin/_components/AdminPageHeader';
import AdminPageLayout from '@/app/admin/_components/AdminPageLayout';
import AdminPanel from '@/app/admin/_components/AdminPanel';
import { getAppConfig } from '@/lib/app-settings';
import { groupIngredientsBySection, listRecipeIngredientCatalog } from '@/lib/pantry-ingredients-catalog';

export default async function AdminPantryDefaultsPage() {
  const [catalog, appConfig] = await Promise.all([
    listRecipeIngredientCatalog(),
    getAppConfig(),
  ]);

  const sectionCount = groupIngredientsBySection(catalog).length;

  return (
    <AdminPageLayout>
      <AdminPageHeader href="/admin/pantry-defaults" />

      <AdminPanel title="How it works">
        <ul className="space-y-2 text-sm leading-relaxed text-admin-muted">
          <li>Ingredients come from every recipe in the catalog ({catalog.length} unique names).</li>
          <li>Checked items are saved to App Settings and applied to new accounts only.</li>
          <li>Existing users keep their own pantry — this does not overwrite them.</li>
          <li>
            Currently {appConfig.defaultPantryIngredients.length} default item
            {appConfig.defaultPantryIngredients.length === 1 ? '' : 's'} across {sectionCount} sections.
          </li>
        </ul>
      </AdminPanel>

      <AdminPanel title="Default pantry checklist">
        <PantryDefaultsEditor
          catalog={catalog}
          initialSelected={appConfig.defaultPantryIngredients}
        />
      </AdminPanel>
    </AdminPageLayout>
  );
}
