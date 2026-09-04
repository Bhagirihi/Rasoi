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
