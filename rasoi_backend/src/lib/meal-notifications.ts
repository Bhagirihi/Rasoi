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
import { db, loadEligibleUsers, type UserWithTokens } from '@/lib/db';
import type { UserWithRelations } from '@/lib/db/types';
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
  /** Admin manual send — still requires an active push token. */
  adminOverride?: boolean;
  /** Admin manual send — allow re-sending the same meal slot today. */
  skipDedup?: boolean;
}

export type UserNotificationEligibility = {
  eligible: boolean;
  reasons: string[];
  pushTokenCount: number;
};

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

type UserWithTokensLocal = UserWithTokens;

async function loadPublishedRecipes(): Promise<RecipeResponse[]> {
  const rows = await db.recipe.findMany({ where: { published: true } });
  return rows.map(serializeRecipe);
}

export async function getUserNotificationEligibility(
  userId: string,
): Promise<UserNotificationEligibility> {
  const user = (await db.user.findUnique({
    where: { id: userId },
    select: {
      isGuest: true,
      isActive: true,
      hasCompletedOnboarding: true,
      notificationsEnabled: true,
      pushTokens: { where: { active: true }, select: { id: true } },
    },
  })) as (UserWithRelations & { pushTokens: { id: string }[] }) | null;

  if (!user) {
    return { eligible: false, reasons: ['User not found'], pushTokenCount: 0 };
  }

  const reasons: string[] = [];
  if (user.isGuest) reasons.push('Guest account');
  if (!user.isActive) reasons.push('Account deactivated');
  if (!user.hasCompletedOnboarding) reasons.push('Onboarding incomplete');
  if (!user.notificationsEnabled) reasons.push('Notifications disabled');
  if (user.pushTokens.length === 0) reasons.push('No active push token');

  return {
    eligible: reasons.length === 0,
    reasons,
    pushTokenCount: user.pushTokens.length,
  };
}

async function loadEligibleUsersForNotifications(
  userId?: string,
  adminOverride?: boolean,
): Promise<UserWithTokensLocal[]> {
  return loadEligibleUsers(userId, adminOverride);
}

async function getSentRecipeIdsToday(
  userId: string,
  mealSlot: MealSlot,
  dayKey: string,
): Promise<string[]> {
  const logs = await db.mealNotificationLog.findMany({
    where: { userId, mealSlot, dayKey },
    select: { recipeId: true },
  });
  return logs.map((l) => l.recipeId);
}

function buildPayload(
  recipe: RecipeResponse,
  mealSlot: MealSlot,
  user: UserWithTokensLocal,
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

  const skipDedup = options.skipDedup ?? false;

  const [users, recipes] = await Promise.all([
    loadEligibleUsersForNotifications(options.userId, options.adminOverride),
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

      if (!skipDedup) {
        const existing = await db.mealNotificationLog.findUnique({
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

      await db.mealNotificationLog.upsert({
        where: {
          userId_mealSlot_dayKey: {
            userId: user.id,
            mealSlot,
            dayKey,
          },
        },
        create: {
          userId: user.id,
          mealSlot,
          dayKey,
          recipeId: recipe.id,
        },
        update: {
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
