import { getMealContext } from '@/utils/mealTime';

export function getLocalizedGreeting(): { greeting: string; subtitle: string } {
  const { greeting, subtitle } = getMealContext();
  return { greeting, subtitle };
}
