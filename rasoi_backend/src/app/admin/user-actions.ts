'use server';

import { revalidatePath } from 'next/cache';

import { getAdminFromCookies } from '@/lib/auth';
import { MEAL_SLOT_LABELS, MEAL_SLOTS, type MealSlot } from '@/lib/meal-time';
import {
  buildCustomPushMessage,
  sendExpoPushMessages,
} from '@/lib/expo-push';
import {
  getUserNotificationEligibility,
  runMealNotifications,
} from '@/lib/meal-notifications';
import { prisma } from '@/lib/prisma';

async function requireAdminSession() {
  const admin = await getAdminFromCookies();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}

function isMealSlot(value: string): value is MealSlot {
  return MEAL_SLOTS.includes(value as MealSlot);
}

export type SendMealNotificationResult = {
  ok: boolean;
  message: string;
  recipeTitle?: string;
  mealSlot?: MealSlot;
  dryRun?: boolean;
};

export type BulkMealNotificationResult = {
  ok: boolean;
  message: string;
  attempted: number;
  succeeded: number;
  failed: number;
  previews: string[];
};

async function deliverMealNotification(
  userId: string,
  mealSlot: MealSlot,
  dryRun: boolean,
): Promise<SendMealNotificationResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });
  if (!user) {
    return { ok: false, message: 'User not found' };
  }

  const eligibility = await getUserNotificationEligibility(userId);
  if (eligibility.pushTokenCount === 0) {
    return {
      ok: false,
      message: `${user.name}: no active push token`,
    };
  }

  const result = await runMealNotifications({
    userId,
    forceSlot: mealSlot,
    dryRun,
    adminOverride: true,
    skipDedup: true,
  });

  if (result.usersConsidered === 0) {
    return {
      ok: false,
      message: `${user.name}: no active push token`,
    };
  }

  if (result.skippedNoRecipe > 0) {
    return {
      ok: false,
      message: `${user.name}: no matching recipe for this slot`,
    };
  }

  if (result.notificationsSent === 0) {
    return {
      ok: false,
      message: result.errors[0] ?? `${user.name}: notification was not sent`,
    };
  }

  const sample = result.samples[0];
  const slotLabel = MEAL_SLOT_LABELS[mealSlot];
  const warning =
    eligibility.reasons.length > 0
      ? ` (${eligibility.reasons.join(', ')} — admin override)`
      : '';

  if (dryRun) {
    return {
      ok: true,
      dryRun: true,
      mealSlot,
      recipeTitle: sample?.recipeTitle,
      message: `${user.name}: “${sample?.recipeTitle ?? 'recipe'}” (${slotLabel})`,
    };
  }

  return {
    ok: true,
    mealSlot,
    recipeTitle: sample?.recipeTitle,
    message: `Sent “${sample?.recipeTitle ?? 'recipe'}” to ${user.name} (${slotLabel}).${warning}`,
  };
}

export async function sendMealNotificationAction(
  userId: string,
  mealSlot: string,
  options?: { dryRun?: boolean },
): Promise<SendMealNotificationResult> {
  await requireAdminSession();

  if (!isMealSlot(mealSlot)) {
    throw new Error('Invalid meal slot');
  }

  const dryRun = options?.dryRun ?? false;
  const result = await deliverMealNotification(userId, mealSlot, dryRun);

  if (result.ok && !dryRun) {
    revalidatePath('/admin/users');
  }

  return result;
}

export async function sendBulkMealNotificationAction(
  userIds: string[],
  mealSlot: string,
  options?: { dryRun?: boolean },
): Promise<BulkMealNotificationResult> {
  await requireAdminSession();

  if (!isMealSlot(mealSlot)) {
    throw new Error('Invalid meal slot');
  }

  const uniqueIds = [...new Set(userIds.filter(Boolean))];
  if (uniqueIds.length === 0) {
    return {
      ok: false,
      message: 'No users selected.',
      attempted: 0,
      succeeded: 0,
      failed: 0,
      previews: [],
    };
  }

  const dryRun = options?.dryRun ?? false;
  const results = await Promise.all(
    uniqueIds.map((userId) => deliverMealNotification(userId, mealSlot, dryRun)),
  );

  const succeeded = results.filter((result) => result.ok).length;
  const failed = results.length - succeeded;
  const previews = results.filter((result) => result.ok).map((result) => result.message);

  if (!dryRun && succeeded > 0) {
    revalidatePath('/admin/users');
  }

  const slotLabel = MEAL_SLOT_LABELS[mealSlot];
  if (succeeded === 0) {
    return {
      ok: false,
      message: `Could not ${dryRun ? 'preview' : 'send'} ${slotLabel} picks for any user.`,
      attempted: uniqueIds.length,
      succeeded,
      failed,
      previews,
    };
  }

  return {
    ok: true,
    attempted: uniqueIds.length,
    succeeded,
    failed,
    previews,
    message: dryRun
      ? `Preview ready for ${succeeded} of ${uniqueIds.length} users (${slotLabel}).`
      : `Sent ${slotLabel} picks to ${succeeded} of ${uniqueIds.length} users${failed > 0 ? ` (${failed} failed)` : ''}.`,
  };
}

export async function getUserNotificationEligibilityAction(userId: string) {
  await requireAdminSession();
  return getUserNotificationEligibility(userId);
}

export type SendCustomNotificationResult = {
  ok: boolean;
  message: string;
  devicesSent?: number;
  devicesFailed?: number;
};

export async function sendCustomNotificationAction(
  userId: string,
  title: string,
  body: string,
): Promise<SendCustomNotificationResult> {
  await requireAdminSession();

  const trimmedTitle = title.trim();
  const trimmedBody = body.trim();

  if (!trimmedTitle) {
    return { ok: false, message: 'Title is required.' };
  }
  if (!trimmedBody) {
    return { ok: false, message: 'Message body is required.' };
  }
  if (trimmedTitle.length > 100) {
    return { ok: false, message: 'Title must be 100 characters or fewer.' };
  }
  if (trimmedBody.length > 500) {
    return { ok: false, message: 'Message must be 500 characters or fewer.' };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      pushTokens: {
        where: { active: true },
        select: { expoPushToken: true },
      },
    },
  });

  if (!user) {
    return { ok: false, message: 'User not found.' };
  }

  if (user.pushTokens.length === 0) {
    return { ok: false, message: `${user.name}: no active push token.` };
  }

  const messages = user.pushTokens.map((token) =>
    buildCustomPushMessage(token.expoPushToken, {
      title: trimmedTitle,
      body: trimmedBody,
    }),
  );

  const results = await sendExpoPushMessages(messages);
  const devicesSent = results.filter((result) => result.ok).length;
  const devicesFailed = results.length - devicesSent;

  if (devicesSent === 0) {
    return {
      ok: false,
      message: results[0]?.error ?? `Could not deliver to ${user.name}.`,
      devicesSent,
      devicesFailed,
    };
  }

  revalidatePath('/admin/users');

  return {
    ok: true,
    devicesSent,
    devicesFailed,
    message:
      devicesFailed > 0
        ? `Sent to ${devicesSent} device${devicesSent === 1 ? '' : 's'} for ${user.name} (${devicesFailed} failed).`
        : `Custom notification sent to ${user.name} on ${devicesSent} device${devicesSent === 1 ? '' : 's'}.`,
  };
}

export type SetUserActiveResult = {
  ok: boolean;
  message: string;
  isActive?: boolean;
};

export async function setUserActiveAction(
  userId: string,
  isActive: boolean,
): Promise<SetUserActiveResult> {
  await requireAdminSession();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, isActive: true },
  });

  if (!user) {
    return { ok: false, message: 'User not found.' };
  }

  if (user.isActive === isActive) {
    return {
      ok: true,
      isActive,
      message: `${user.name} is already ${isActive ? 'active' : 'deactivated'}.`,
    };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isActive },
  });

  revalidatePath('/admin/users');

  return {
    ok: true,
    isActive,
    message: isActive
      ? `${user.name} has been reactivated. They can sign in again.`
      : `${user.name} has been deactivated. They cannot use the app until reactivated.`,
  };
}
