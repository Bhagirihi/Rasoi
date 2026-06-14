import {
  buildMealPushMessage,
  sendExpoPushMessages,
  type MealPushPayload,
} from '@/lib/expo-push';
import {
  getLocalTimeParts,
  getMealSlotsDueNow,
  getNextMealSlotLabel,
  MEAL_SLOT_LABELS,
  minutesUntilNextMeal,
  type MealSlot,
} from '@/lib/meal-time';
import { prisma } from '@/lib/prisma';
import {
  buildMealNotificationBody,
  pickTopRecipeForMeal,
} from '@/lib/recipe-ranking';
import { parseJson, serializeRecipe } from '@/lib/serializers';
import type { CuisineId, RecipeResponse } from '@/lib/types';

export interface MealNotificationRunOptions {
  now?: Date;
  forceSlot?: MealSlot;
  userId?: string;
  dryRun?: boolean;
  toleranceMinutes?: number;
}

export interface MealNotificationRunResult {
  ok: boolean;
  slotsProcessed: MealSlot[];
  usersConsidered: number;
  notificationsSent: number;
  skippedAlreadySent: number;
  skippedNoRecipe: number;
  skippedNoToken: number;
  errors: string[];
  samples: Array<{
    userId: string;
    mealSlot: MealSlot;
    recipeId: string;
    recipeTitle: string;
  }>;
}

type UserWithTokens = {
  id: string;
  dietChoice: string;
  regionalCuisine: string;
  favoriteCuisines: string;
  pantryIngredients: string;
  timezone: string;
  pushTokens: { expoPushToken: string }[];
};

async function loadPublishedRecipes(): Promise<RecipeResponse[]> {
  const rows = await prisma.recipe.findMany({ where: { published: true } });
  return rows.map(serializeRecipe);
}

async function loadEligibleUsers(userId?: string): Promise<UserWithTokens[]> {
  return prisma.user.findMany({
    where: {
      notificationsEnabled: true,
      isGuest: false,
      hasCompletedOnboarding: true,
      ...(userId ? { id: userId } : {}),
      pushTokens: { some: { active: true } },
    },
    select: {
      id: true,
      dietChoice: true,
      regionalCuisine: true,
      favoriteCuisines: true,
      pantryIngredients: true,
      timezone: true,
      pushTokens: {
        where: { active: true },
        select: { expoPushToken: true },
      },
    },
  });
}

async function getSentRecipeIdsToday(
  userId: string,
  mealSlot: MealSlot,
  dayKey: string,
): Promise<string[]> {
  const logs = await prisma.mealNotificationLog.findMany({
    where: { userId, mealSlot, dayKey },
    select: { recipeId: true },
  });
  return logs.map((l) => l.recipeId);
}

function buildPayload(
  recipe: RecipeResponse,
  mealSlot: MealSlot,
  user: UserWithTokens,
  now: Date,
): MealPushPayload {
  const timezone = user.timezone || 'Asia/Kolkata';
  const nextMealSlot = getNextMealSlotLabel(timezone, now);
  const nextMealInMinutes = minutesUntilNextMeal(timezone, now);

  return {
    type: 'meal_pick',
    mealSlot,
    recipeId: recipe.id,
    recipeTitle: recipe.title,
    imageUrl: recipe.imageUrl,
    prepTime: recipe.prepTime,
    difficulty: recipe.difficulty,
    regionalCuisine: user.regionalCuisine,
    nextMealSlot,
    nextMealInMinutes,
    actions: {
      cook: 'Cook This',
      more: 'More',
      save: 'Save',
    },
  };
}

export async function runMealNotifications(
  options: MealNotificationRunOptions = {},
): Promise<MealNotificationRunResult> {
  const now = options.now ?? new Date();
  const dryRun = options.dryRun ?? false;
  const toleranceMinutes = options.toleranceMinutes ?? 15;

  const result: MealNotificationRunResult = {
    ok: true,
    slotsProcessed: [],
    usersConsidered: 0,
    notificationsSent: 0,
    skippedAlreadySent: 0,
    skippedNoRecipe: 0,
    skippedNoToken: 0,
    errors: [],
    samples: [],
  };

  const [users, recipes] = await Promise.all([
    loadEligibleUsers(options.userId),
    loadPublishedRecipes(),
  ]);

  if (recipes.length === 0) {
    result.ok = false;
    result.errors.push('No published recipes');
    return result;
  }

  result.usersConsidered = users.length;

  const slotSet = new Set<MealSlot>();

  for (const user of users) {
    const timezone = user.timezone?.trim() || 'Asia/Kolkata';
    const { dayKey } = getLocalTimeParts(timezone, now);

    const slotsDue = options.forceSlot
      ? [options.forceSlot]
      : getMealSlotsDueNow(timezone, now, toleranceMinutes);

    if (slotsDue.length === 0) continue;

    const favoriteCuisines = parseJson<CuisineId[]>(user.favoriteCuisines, []);
    const pantryIngredients = parseJson<string[]>(user.pantryIngredients, []);
    const tokens = user.pushTokens.map((t) => t.expoPushToken).filter(Boolean);

    if (tokens.length === 0) {
      result.skippedNoToken += slotsDue.length;
      continue;
    }

    for (const mealSlot of slotsDue) {
      slotSet.add(mealSlot);

      const existing = await prisma.mealNotificationLog.findUnique({
        where: {
          userId_mealSlot_dayKey: {
            userId: user.id,
            mealSlot,
            dayKey,
          },
        },
      });

      if (existing) {
        result.skippedAlreadySent += 1;
        continue;
      }

      const sentTodayIds = await getSentRecipeIdsToday(user.id, mealSlot, dayKey);

      const recipe = pickTopRecipeForMeal(recipes, {
        dietChoice: user.dietChoice,
        regionalCuisine: user.regionalCuisine,
        favoriteCuisines,
        pantryIngredients,
        mealSlot,
        excludeRecipeIds: sentTodayIds,
      });

      if (!recipe) {
        result.skippedNoRecipe += 1;
        continue;
      }

      const payload = buildPayload(recipe, mealSlot, user, now);
      const body = buildMealNotificationBody(recipe);
      const mealSlotLabel = MEAL_SLOT_LABELS[mealSlot];

      if (dryRun) {
        result.notificationsSent += tokens.length;
        result.samples.push({
          userId: user.id,
          mealSlot,
          recipeId: recipe.id,
          recipeTitle: recipe.title,
        });
        continue;
      }

      const messages = tokens.map((token) =>
        buildMealPushMessage(token, { mealSlotLabel, body, payload }),
      );

      const pushResults = await sendExpoPushMessages(messages);
      const successCount = pushResults.filter((r) => r.ok).length;

      if (successCount === 0) {
        result.errors.push(
          `Push failed for user ${user.id} (${mealSlot}): ${pushResults.map((r) => r.error).filter(Boolean).join(', ')}`,
        );
        continue;
      }

      await prisma.mealNotificationLog.create({
        data: {
          userId: user.id,
          mealSlot,
          dayKey,
          recipeId: recipe.id,
        },
      });

      result.notificationsSent += successCount;
      if (result.samples.length < 10) {
        result.samples.push({
          userId: user.id,
          mealSlot,
          recipeId: recipe.id,
          recipeTitle: recipe.title,
        });
      }
    }
  }

  result.slotsProcessed = [...slotSet];
  return result;
}
