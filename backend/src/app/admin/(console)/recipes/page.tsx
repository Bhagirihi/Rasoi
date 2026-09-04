import Link from 'next/link';
import { Suspense } from 'react';

import DownloadMarkdownSampleButton from '@/app/admin/(console)/recipes/DownloadMarkdownSampleButton';
import ConfirmDeleteForm from '@/app/admin/_components/ConfirmDeleteForm';
import AdminCallout from '@/app/admin/_components/AdminCallout';
import AdminPageHeader from '@/app/admin/_components/AdminPageHeader';
import AdminPageLayout from '@/app/admin/_components/AdminPageLayout';
import { DataTable } from '@/app/admin/_components/DataTable';
import RecipeFilterPanel from '@/app/admin/_components/RecipeFilterPanel';
import { buildAdminPageHref, TablePagination } from '@/app/admin/_components/TablePagination';
import { Badge, PrimaryButton } from '@/app/admin/_components/ui';
import { deleteRecipeAction } from '@/app/admin/recipe-actions';
import { buildRecipeWhere } from '@/lib/recipe-filters';
import { db } from '@/lib/db';
import { parsePageParams } from '@/lib/pagination';
import { serializeRecipe } from '@/lib/serializers';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const ADMIN_RECIPE_PAGE_SIZE = 50;

function param(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function AdminRecipesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filterParams = {
    region: param(params.region),
    dietChoice: param(params.dietChoice),
    tag: param(params.tag),
    difficulty: param(params.difficulty),
    published: param(params.published) ?? 'all',
  };

  const where = buildRecipeWhere(filterParams, { adminIncludeDrafts: true });
  const pageParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const resolved = param(value);
    if (resolved) pageParams.set(key, resolved);
  }
  pageParams.set('limit', String(ADMIN_RECIPE_PAGE_SIZE));
  const { page, pageSize, offset } = parsePageParams(pageParams, {
    defaultLimit: ADMIN_RECIPE_PAGE_SIZE,
    maxLimit: ADMIN_RECIPE_PAGE_SIZE,
  });

  const [recipes, filteredCount, totalCount] = await Promise.all([
    db.recipe.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip: offset,
    }),
    db.recipe.count({ where }),
    db.recipe.count(),
  ]);

  const hasFilters =
    filterParams.dietChoice ||
    (filterParams.region && filterParams.region !== 'all') ||
    (filterParams.tag && filterParams.tag !== 'all') ||
    (filterParams.difficulty && filterParams.difficulty !== 'all') ||
    (filterParams.published && filterParams.published !== 'all');

  return (
    <AdminPageLayout>
      <AdminPageHeader
        href="/admin/recipes"
        description={
          hasFilters
            ? `Showing ${recipes.length === 0 ? 0 : offset + 1}–${offset + recipes.length} of ${filteredCount} matching recipes (${totalCount} total in library).`
            : `Showing ${recipes.length === 0 ? 0 : offset + 1}–${offset + recipes.length} of ${totalCount} dishes. Filter by diet and region like the mobile app.`
        }
        action={
          <div className="flex flex-wrap items-center gap-2">
            <DownloadMarkdownSampleButton />
            <PrimaryButton href="/admin/recipes/new">Add recipe</PrimaryButton>
          </div>
        }
      />

      <AdminCallout>
        Saves update <strong>rasoi → Recipe</strong> (source of truth for the app). If you use Supabase
        Table Editor, check schema <strong>rasoi</strong> or <strong>public → recipes</strong> (synced on
        each save).
      </AdminCallout>

      <Suspense fallback={null}>
        <RecipeFilterPanel />
      </Suspense>

      <DataTable
        columns={['Title', 'Region', 'Diet', 'Tags', 'Status', 'Actions']}
        emptyMessage="No recipes match these filters. Try All India / All diets."
        footer={`${filteredCount} recipe${filteredCount === 1 ? '' : 's'} in view`}
      >
        {recipes.map((recipe) => {
          const serialized = serializeRecipe(recipe);
          return (
            <tr key={recipe.id} className="transition hover:bg-[#f7f2ea]">
              <td className="px-5 py-4">
                <p className="font-medium text-admin-ink">{serialized.title}</p>
                <p className="mt-1 text-xs text-admin-muted">
                  {serialized.prepTime} min · {serialized.calories} cal · {serialized.difficulty}
                </p>
              </td>
              <td className="px-5 py-4">
                <Badge tone="neutral">{serialized.region}</Badge>
              </td>
              <td className="px-5 py-4">
                <Badge
                  tone={
                    serialized.dietType === 'Veg'
                      ? 'success'
                      : serialized.dietType === 'Egg'
                        ? 'gold'
                        : 'warning'
                  }
                >
                  {serialized.dietType}
                </Badge>
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-1">
                  {serialized.tags.length === 0 ? (
                    <span className="text-xs text-admin-muted">—</span>
                  ) : (
                    serialized.tags.map((tag) => (
                      <Badge key={tag} tone="neutral">{tag}</Badge>
                    ))
                  )}
                </div>
              </td>
              <td className="px-5 py-4">
                <Badge tone={serialized.published ? 'success' : 'warning'}>
                  {serialized.published ? 'Published' : 'Draft'}
                </Badge>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/recipes/${recipe.id}`}
                    className="text-sm font-semibold text-admin-saffron hover:text-admin-ink"
                  >
                    Edit
                  </Link>
                  <ConfirmDeleteForm
                    action={deleteRecipeAction.bind(null, recipe.id)}
                    confirmMessage={`Delete "${serialized.title}"? This cannot be undone.`}
                    successMessage={`Deleted "${serialized.title}".`}
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
          );
        })}
      </DataTable>

      <TablePagination
        page={page}
        pageSize={pageSize}
        total={filteredCount}
        buildHref={(nextPage) => buildAdminPageHref('/admin/recipes', params, nextPage)}
      />
    </AdminPageLayout>
  );
}
