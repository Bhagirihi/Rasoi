import Link from 'next/link';
import { Suspense } from 'react';

import DownloadMarkdownSampleButton from '@/app/admin/(console)/recipes/DownloadMarkdownSampleButton';
import ConfirmDeleteForm from '@/app/admin/_components/ConfirmDeleteForm';
import { DataTable } from '@/app/admin/_components/DataTable';
import RecipeFilterPanel from '@/app/admin/_components/RecipeFilterPanel';
import { Badge, PageHeader, PrimaryButton } from '@/app/admin/_components/ui';
import { deleteRecipeAction } from '@/app/admin/recipe-actions';
import { buildRecipeWhere } from '@/lib/recipe-filters';
import { prisma } from '@/lib/prisma';
import { serializeRecipe } from '@/lib/serializers';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

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
  const recipes = await prisma.recipe.findMany({ where, orderBy: { createdAt: 'desc' } });
  const totalCount = await prisma.recipe.count();

  const hasFilters =
    filterParams.dietChoice ||
    (filterParams.region && filterParams.region !== 'all') ||
    (filterParams.tag && filterParams.tag !== 'all') ||
    (filterParams.difficulty && filterParams.difficulty !== 'all') ||
    (filterParams.published && filterParams.published !== 'all');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Recipes"
        description={
          hasFilters
            ? `Showing ${recipes.length} of ${totalCount} recipes with current filters.`
            : `${totalCount} dishes in the library. Filter by diet and region like the mobile app.`
        }
        action={
          <div className="flex flex-wrap items-center gap-2">
            <DownloadMarkdownSampleButton />
            <PrimaryButton href="/admin/recipes/new">Add recipe</PrimaryButton>
          </div>
        }
      />

      <p className="rounded-xl border border-admin-border bg-[#f7f2ea] px-4 py-3 text-sm text-admin-muted">
        Saves update <strong className="text-admin-ink">rasoi → Recipe</strong> (source of truth for the app).
        If you use Supabase Table Editor, check schema <strong className="text-admin-ink">rasoi</strong> or{' '}
        <strong className="text-admin-ink">public → recipes</strong> (synced on each save).
      </p>

      <Suspense fallback={null}>
        <RecipeFilterPanel />
      </Suspense>

      <DataTable
        columns={['Title', 'Region', 'Diet', 'Tags', 'Status', 'Actions']}
        emptyMessage="No recipes match these filters. Try All India / All diets."
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
    </div>
  );
}
