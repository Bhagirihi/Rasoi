import { redirect } from 'next/navigation';

import RecipeForm from '@/app/admin/(console)/recipes/RecipeForm';
import { db } from '@/lib/db';
import { serializeRecipe } from '@/lib/serializers';

type PageProps = { params: Promise<{ id: string }> };

export default async function EditRecipePage({ params }: PageProps) {
  const { id } = await params;
  const recipe = await db.recipe.findUnique({ where: { id } });
  if (!recipe) redirect('/admin/recipes');

  const serialized = serializeRecipe(recipe);

  return (
    <RecipeForm
      mode="edit"
      recipe={serialized}
      pageTitle="Edit recipe"
      pageDescription={`${serialized.title} — preview changes on mobile before updating live.`}
    />
  );
}
