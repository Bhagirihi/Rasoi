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

export const RECIPE_PAGE_SIZE = 100;

/**
 * First page for the home feed. The hero only needs the top pick + a few
 * cards, so the cold-start page fetch is smaller than the full list page.
 * Pagination (load more) still uses RECIPE_PAGE_SIZE.
 */
export const RECIPE_HOME_PAGE_SIZE = 40;
