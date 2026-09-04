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

type ParsePaginationOptions = {
  defaultLimit?: number;
  maxLimit?: number;
};

export function parsePaginationParams(
  searchParams: URLSearchParams,
  options: ParsePaginationOptions = {},
): { limit: number; offset: number } {
  const defaultLimit = options.defaultLimit ?? 100;
  const maxLimit = options.maxLimit ?? 200;

  const rawLimit = Number.parseInt(searchParams.get('limit') ?? String(defaultLimit), 10);
  const rawOffset = Number.parseInt(searchParams.get('offset') ?? '0', 10);

  const limit = Number.isFinite(rawLimit)
    ? Math.min(maxLimit, Math.max(1, rawLimit))
    : defaultLimit;
  const offset = Number.isFinite(rawOffset) ? Math.max(0, rawOffset) : 0;

  return { limit, offset };
}

export function parsePageParams(
  searchParams: URLSearchParams,
  options: ParsePaginationOptions = {},
): { page: number; pageSize: number; offset: number } {
  const pageSize = parsePaginationParams(searchParams, options).limit;
  const rawPage = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const page = Number.isFinite(rawPage) ? Math.max(1, rawPage) : 1;

  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize,
  };
}

export function buildPaginationMeta(
  limit: number,
  offset: number,
  total: number,
  returnedCount: number,
): PaginationMeta {
  const hasMore = offset + returnedCount < total;
  return {
    limit,
    offset,
    total,
    hasMore,
    nextOffset: hasMore ? offset + returnedCount : null,
  };
}

export function paginateArray<T>(items: T[], offset: number, limit: number): PaginatedItems<T> {
  const slice = items.slice(offset, offset + limit);
  return {
    items: slice,
    pagination: buildPaginationMeta(limit, offset, items.length, slice.length),
  };
}
