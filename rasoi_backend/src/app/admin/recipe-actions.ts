'use server';

import { revalidatePath } from 'next/cache';

import { getAdminFromCookies } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { deletePublicRecipe, syncPublicRecipe } from '@/lib/sync-public-recipe';
import { recipeCreateSchema, recipeUpdateSchema } from '@/lib/validators';

async function requireAdminSession() {
  const admin = await getAdminFromCookies();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}

export async function createRecipeAction(raw: unknown) {
  await requireAdminSession();
  const input = recipeCreateSchema.parse(raw);

  const recipe = await prisma.recipe.create({
    data: {
      title: input.title,
      prepTime: input.prepTime,
      calories: input.calories,
      region: input.region,
      kitchenStyleId: input.kitchenStyleId,
      kitchenStyleIds: JSON.stringify(
        input.kitchenStyleIds?.length ? input.kitchenStyleIds : [input.kitchenStyleId],
      ),
      dietType: input.dietType,
      difficulty: input.difficulty,
      description: input.description,
      imageUrl: input.imageUrl,
      tags: JSON.stringify(input.tags),
      ingredients: JSON.stringify(input.ingredients),
      steps: input.steps ? JSON.stringify(input.steps) : null,
      published: input.published,
    },
  });

  try {
    await syncPublicRecipe(recipe);
  } catch (error) {
    console.error('[syncPublicRecipe] create failed', error);
  }

  revalidatePath('/admin/recipes');
  revalidatePath('/admin');
}

export async function updateRecipeAction(id: string, raw: unknown) {
  await requireAdminSession();
  const input = recipeUpdateSchema.parse(raw);

  const recipe = await prisma.recipe.update({
    where: { id },
    data: {
      title: input.title,
      prepTime: input.prepTime,
      calories: input.calories,
      region: input.region,
      kitchenStyleId: input.kitchenStyleId,
      ...(input.kitchenStyleIds !== undefined || input.kitchenStyleId !== undefined
        ? {
            kitchenStyleIds: JSON.stringify(
              input.kitchenStyleIds?.length
                ? input.kitchenStyleIds
                : input.kitchenStyleId
                  ? [input.kitchenStyleId]
                  : [],
            ),
          }
        : {}),
      dietType: input.dietType,
      difficulty: input.difficulty,
      description: input.description,
      imageUrl: input.imageUrl,
      tags: input.tags ? JSON.stringify(input.tags) : undefined,
      ingredients: input.ingredients ? JSON.stringify(input.ingredients) : undefined,
      steps: input.steps ? JSON.stringify(input.steps) : undefined,
      published: input.published,
    },
  });

  try {
    await syncPublicRecipe(recipe);
  } catch (error) {
    console.error('[syncPublicRecipe] update failed', error);
  }

  revalidatePath('/admin/recipes');
  revalidatePath(`/admin/recipes/${id}`);
  revalidatePath('/admin');
}

export async function deleteRecipeAction(id: string) {
  await requireAdminSession();
  await prisma.recipe.delete({ where: { id } });
  try {
    await deletePublicRecipe(id);
  } catch (error) {
    console.error('[deletePublicRecipe] failed', error);
  }
  revalidatePath('/admin/recipes');
}
