#!/usr/bin/env tsx
/**
 * Local test: send meal notifications (dry-run by default).
 *
 *   npm run cron:meal-notifications
 *   npm run cron:meal-notifications -- --forceSlot=dinner --send
 *   npm run cron:meal-notifications -- --userId=cmxxx --forceSlot=lunch --send
 */
import 'dotenv/config';

import { runMealNotifications } from '../src/lib/meal-notifications';
import { MEAL_SLOTS, type MealSlot } from '../src/lib/meal-time';

function parseArgs() {
  const args = process.argv.slice(2);
  let forceSlot: MealSlot | undefined;
  let userId: string | undefined;
  let send = false;

  for (const arg of args) {
    if (arg.startsWith('--forceSlot=')) {
      const value = arg.split('=')[1];
      if (MEAL_SLOTS.includes(value as MealSlot)) forceSlot = value as MealSlot;
    } else if (arg.startsWith('--userId=')) {
      userId = arg.split('=')[1];
    } else if (arg === '--send') {
      send = true;
    }
  }

  return { forceSlot, userId, dryRun: !send };
}

async function main() {
  const { forceSlot, userId, dryRun } = parseArgs();

  console.log(
    dryRun
      ? '[dry-run] Picking meal notifications (pass --send to push)'
      : '[live] Sending meal push notifications',
  );

  const result = await runMealNotifications({ forceSlot, userId, dryRun });

  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
