import { redirect } from 'next/navigation';

import RecipeForm from '@/app/admin/(console)/recipes/RecipeForm';
import { db } from '@/lib/db';
import { serializeRecipe } from '@/lib/serializers';

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

type PageProps = { params: Promise<{ id: string }> };

export default async function EditRecipePage({ params }: PageProps) {
  const { id } = await params;
  const recipe = await db.recipe.findUnique({ where: { id } });
  if (!recipe) redirect('/admin/recipes');

  const serialized = serializeRecipe(recipe);
  const storedStepsHi = parseJson<string[]>(recipe.stepsHi, []);

  return (
    <RecipeForm
      mode="edit"
      recipe={{
        ...serialized,
        descriptionHi: recipe.descriptionHi?.trim() || undefined,
        stepsHi: storedStepsHi.length > 0 ? storedStepsHi : undefined,
      }}
      pageTitle="Edit recipe"
      pageDescription={`${serialized.title} — preview changes on mobile before updating live.`}
    />
  );
}
