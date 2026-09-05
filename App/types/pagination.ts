export type PaginationMeta = {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
  nextOffset: number | null;
};

export type PaginatedItems<T> = {
  items: T[];
  pagination: PaginationMeta;
};

/** Recipes tab page size — enough for a first browse without a 100-row download. */
export const RECIPE_PAGE_SIZE = 45;
/** 3-day plan: 5 meal slots × 3 days. */
export const PLAN_MENU_SIZE = 15;
/** Home hero: 1 meal pick, or 2 in the late-night window. */
export const HOME_PICK_FETCH_COUNT = 2;
