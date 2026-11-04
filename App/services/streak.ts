import { authApiFetch } from "@/utils/api";

export interface CookingStreak {
  current: number;
  cookedToday: boolean;
  lastCookedDay: string | null;
}

export async function fetchStreak(): Promise<CookingStreak> {
  const response = await authApiFetch<{ streak: CookingStreak }>(
    "/api/users/me/streak",
  );
  return response.streak;
}

/** Explicit "I cooked this" tap. Throws on failure so the button can stay enabled. */
export async function markRecipeCooked(
  recipeId: string,
): Promise<CookingStreak> {
  const response = await authApiFetch<{ ok: boolean; streak: CookingStreak }>(
    `/api/recipes/${encodeURIComponent(recipeId)}/cooked`,
    {
      method: "POST",
      body: JSON.stringify({}),
    },
  );
  return response.streak;
}
