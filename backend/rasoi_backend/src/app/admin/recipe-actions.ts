'use server';

import { revalidatePath } from 'next/cache';

import { getAdminFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';
import { formatMainIngredientsColumn } from '@/lib/recipe-main-ingredients';
import { recipeCreateSchema, recipeUpdateSchema } from '@/lib/validators';

async function requireAdminSession() {
  const admin = await getAdminFromCookies();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}

export async function createRecipeAction(raw: unknown) {
  await requireAdminSession();
  const input = recipeCreateSchema.parse(raw);
  const mainIngredients =
    input.mainIngredients !== undefined
      ? formatMainIngredientsColumn(input.mainIngredients)
      : null;

  await db.recipe.create({
    data: {
      title: input.title,
      prepTime: input.prepTime,
      calories: input.calories,
      region: input.region,
      kitchenStyleId: input.kitchenStyleId,
      dietType: input.dietType,
      difficulty: input.difficulty,
      descriptionHi: input.descriptionHi?.trim() || null,
      imageUrl: input.imageUrl,
      ingredients: JSON.stringify(input.ingredients),
      main_ingredients: mainIngredients,
      steps: input.steps ? JSON.stringify(input.steps) : null,
      stepsHi: input.stepsHi?.length ? JSON.stringify(input.stepsHi) : null,
      published: input.published,
    },
  });

  revalidatePath('/admin/recipes');
  revalidatePath('/admin');
}

export async function updateRecipeAction(id: string, raw: unknown) {
  await requireAdminSession();
  const input = recipeUpdateSchema.parse(raw);

  await db.recipe.update({
    where: { id },
    data: {
      title: input.title,
      prepTime: input.prepTime,
      calories: input.calories,
      region: input.region,
      kitchenStyleId: input.kitchenStyleId,
      dietType: input.dietType,
      difficulty: input.difficulty,
      descriptionHi:
        input.descriptionHi !== undefined ? input.descriptionHi.trim() || null : undefined,
      imageUrl: input.imageUrl,
      ingredients: input.ingredients ? JSON.stringify(input.ingredients) : undefined,
      main_ingredients:
        input.mainIngredients !== undefined
          ? formatMainIngredientsColumn(input.mainIngredients)
          : undefined,
      steps: input.steps ? JSON.stringify(input.steps) : undefined,
      stepsHi:
        input.stepsHi !== undefined
          ? input.stepsHi.length > 0
            ? JSON.stringify(input.stepsHi)
            : null
          : undefined,
      published: input.published,
    },
  });

  revalidatePath('/admin/recipes');
  revalidatePath(`/admin/recipes/${id}`);
  revalidatePath('/admin');
}

export async function deleteRecipeAction(id: string) {
  await requireAdminSession();
  await db.recipe.delete({ where: { id } });
  revalidatePath('/admin/recipes');
}
