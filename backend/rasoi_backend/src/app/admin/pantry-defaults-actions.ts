'use server';

import { revalidatePath } from 'next/cache';

import { setDefaultPantryIngredients } from '@/lib/app-settings';
import { getAdminFromCookies } from '@/lib/auth';
import { defaultPantryUpdateSchema } from '@/lib/validators';

async function requireAdminSession() {
  const admin = await getAdminFromCookies();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}

export async function setDefaultPantryIngredientsAction(ingredients: string[]) {
  await requireAdminSession();
  const input = defaultPantryUpdateSchema.parse({ ingredients });
  await setDefaultPantryIngredients(input.ingredients);
  revalidatePath('/admin/pantry-defaults');
  revalidatePath('/admin');
}
