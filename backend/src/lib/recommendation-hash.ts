import { createHash } from 'crypto';

/** Deterministic SHA256 seed — same inputs always produce the same hash. */
export function recommendationHash(parts: string[]): string {
  return createHash('sha256').update(parts.join('|'), 'utf8').digest('hex');
}

/** Map hash to a stable numeric rank for sorting. */
export function hashToRank(seed: string): number {
  return Number.parseInt(seed.slice(0, 12), 16);
}

export function cuisineOrderSeed(
  userId: string,
  dayKey: string,
  mealSlot: string,
  cuisineId: string,
  algorithmVersion: string,
): number {
  return hashToRank(
    recommendationHash([userId, dayKey, mealSlot, cuisineId, algorithmVersion]),
  );
}

export function recipeTieBreakSeed(
  userId: string,
  dayKey: string,
  mealSlot: string,
  recipeId: string,
  algorithmVersion: string,
): number {
  return hashToRank(
    recommendationHash([userId, dayKey, mealSlot, recipeId, algorithmVersion]),
  );
}
