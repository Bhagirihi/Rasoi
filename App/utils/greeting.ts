import { getScheduledMealContext } from '@/utils/mealTime';

export function getLocalizedGreeting(): { greeting: string; subtitle: string } {
  const { greeting, subtitle } = getScheduledMealContext();
  return { greeting, subtitle };
}
