import { rasoiDb } from '@/lib/db/client';
import { throwIfError } from '@/lib/db/errors';
import type { IncludeShape, OrderBy, SelectFields } from '@/lib/db/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryBuilder = any;

export type RelationDef = {
  table: string;
  fk: string;
  parentKey?: string;
};

export type TableMeta = {
  table: string;
  pk: string;
  uniqueFields: string[];
  compoundUniques: Record<string, string[]>;
  dateFields: Set<string>;
  hasUpdatedAt: boolean;
  relations: Record<string, RelationDef>;
};

const TABLE_META: Record<string, TableMeta> = {
  User: {
    table: 'User',
    pk: 'id',
    uniqueFields: ['id', 'email', 'phone', 'supabaseUserId'],
    compoundUniques: {},
    dateFields: new Set([
      'locationUpdatedAt',
      'trialStartedAt',
      'termsAcceptedAt',
      'createdAt',
      'updatedAt',
    ]),
    hasUpdatedAt: true,
    relations: {
      pushTokens: { table: 'PushToken', fk: 'userId' },
      affiliateEvents: { table: 'AffiliateEvent', fk: 'userId' },
      sponsorEvents: { table: 'SponsorEvent', fk: 'userId' },
      mealNotificationLogs: { table: 'MealNotificationLog', fk: 'userId' },
      feedback: { table: 'UserFeedback', fk: 'userId' },
    },
  },
  ProcessedWebhookEvent: {
    table: 'ProcessedWebhookEvent',
    pk: 'eventId',
    uniqueFields: ['eventId'],
    compoundUniques: {},
    dateFields: new Set(['createdAt']),
    hasUpdatedAt: false,
    relations: {},
  },
  MealNotificationLog: {
    table: 'MealNotificationLog',
    pk: 'id',
    uniqueFields: ['id'],
    compoundUniques: { userId_mealSlot_dayKey: ['userId', 'mealSlot', 'dayKey'] },
    dateFields: new Set(['sentAt']),
    hasUpdatedAt: false,
    relations: {
      user: { table: 'User', fk: 'userId', parentKey: 'id' },
    },
  },
  AffiliateEvent: {
    table: 'AffiliateEvent',
    pk: 'id',
    uniqueFields: ['id'],
    compoundUniques: {},
    dateFields: new Set(['createdAt']),
    hasUpdatedAt: false,
    relations: {
      user: { table: 'User', fk: 'userId', parentKey: 'id' },
    },
  },
  SponsorEvent: {
    table: 'SponsorEvent',
    pk: 'id',
    uniqueFields: ['id'],
    compoundUniques: {},
    dateFields: new Set(['createdAt']),
    hasUpdatedAt: false,
    relations: {
      user: { table: 'User', fk: 'userId', parentKey: 'id' },
    },
  },
  PushToken: {
    table: 'PushToken',
    pk: 'id',
    uniqueFields: ['id'],
    compoundUniques: { userId_expoPushToken: ['userId', 'expoPushToken'] },
    dateFields: new Set(['createdAt', 'updatedAt']),
    hasUpdatedAt: true,
    relations: {
      user: { table: 'User', fk: 'userId', parentKey: 'id' },
    },
  },
  Admin: {
    table: 'Admin',
    pk: 'id',
    uniqueFields: ['id', 'email'],
    compoundUniques: {},
    dateFields: new Set(['createdAt', 'updatedAt']),
    hasUpdatedAt: true,
    relations: {},
  },
  Recipe: {
    table: 'Recipe',
    pk: 'id',
    uniqueFields: ['id'],
    compoundUniques: {},
    dateFields: new Set(['createdAt', 'updatedAt']),
    hasUpdatedAt: true,
    relations: {},
  },
  UserRecommendationCache: {
    table: 'UserRecommendationCache',
    pk: 'id',
    uniqueFields: ['id'],
    compoundUniques: { userId_windowKey_algorithmVersion: ['userId', 'windowKey', 'algorithmVersion'] },
    dateFields: new Set(['generatedAt']),
    hasUpdatedAt: false,
    relations: {
      user: { table: 'User', fk: 'userId', parentKey: 'id' },
    },
  },
  UserRecommendationHistory: {
    table: 'UserRecommendationHistory',
    pk: 'id',
    uniqueFields: ['id'],
    compoundUniques: {},
    dateFields: new Set(['shownAt']),
    hasUpdatedAt: false,
    relations: {
      user: { table: 'User', fk: 'userId', parentKey: 'id' },
    },
  },
  UserRecipeView: {
    table: 'UserRecipeView',
    pk: 'id',
    uniqueFields: ['id'],
    compoundUniques: { userId_recipeId: ['userId', 'recipeId'] },
    dateFields: new Set(['viewedAt']),
    hasUpdatedAt: false,
    relations: {
      user: { table: 'User', fk: 'userId', parentKey: 'id' },
    },
  },
  UserRecipeCooked: {
    table: 'UserRecipeCooked',
    pk: 'id',
    uniqueFields: ['id'],
    compoundUniques: { userId_recipeId: ['userId', 'recipeId'] },
    dateFields: new Set(['cookedAt']),
    hasUpdatedAt: false,
    relations: {
      user: { table: 'User', fk: 'userId', parentKey: 'id' },
    },
  },
  Sponsor: {
    table: 'Sponsor',
    pk: 'id',
    uniqueFields: ['id'],
    compoundUniques: {},
    dateFields: new Set(['createdAt', 'updatedAt']),
    hasUpdatedAt: true,
    relations: {},
  },
  PartnerLink: {
    table: 'PartnerLink',
    pk: 'partnerId',
    uniqueFields: ['partnerId'],
    compoundUniques: {},
    dateFields: new Set(['updatedAt']),
    hasUpdatedAt: true,
    relations: {},
  },
  KitchenStyle: {
    table: 'KitchenStyle',
    pk: 'id',
    uniqueFields: ['id'],
    compoundUniques: {},
    dateFields: new Set(['createdAt', 'updatedAt']),
    hasUpdatedAt: true,
    relations: {},
  },
  RegionalCuisineOption: {
    table: 'RegionalCuisineOption',
    pk: 'label',
    uniqueFields: ['label'],
    compoundUniques: {},
    dateFields: new Set(),
    hasUpdatedAt: false,
    relations: {},
  },
  PantrySection: {
    table: 'PantrySection',
    pk: 'id',
    uniqueFields: ['id'],
    compoundUniques: {},
    dateFields: new Set(),
    hasUpdatedAt: false,
    relations: {},
  },
  AppSettings: {
    table: 'AppSettings',
    pk: 'id',
    uniqueFields: ['id'],
    compoundUniques: {},
    dateFields: new Set(['updatedAt']),
    hasUpdatedAt: true,
    relations: {},
  },
  HomeAnnouncement: {
    table: 'HomeAnnouncement',
    pk: 'id',
    uniqueFields: ['id', 'campaignKey'],
    compoundUniques: {},
    dateFields: new Set(['startsAt', 'endsAt', 'createdAt', 'updatedAt']),
    hasUpdatedAt: true,
    relations: {},
  },
  SponsorApplication: {
    table: 'SponsorApplication',
    pk: 'id',
    uniqueFields: ['id'],
    compoundUniques: {},
    dateFields: new Set(['createdAt', 'updatedAt']),
    hasUpdatedAt: true,
    relations: {},
  },
  UserFeedback: {
    table: 'UserFeedback',
    pk: 'id',
    uniqueFields: ['id'],
    compoundUniques: {},
    dateFields: new Set(['createdAt', 'updatedAt']),
    hasUpdatedAt: true,
    relations: {
      user: { table: 'User', fk: 'userId', parentKey: 'id' },
    },
  },
  PromoCode: {
    table: 'PromoCode',
    pk: 'id',
    uniqueFields: ['id', 'code'],
    compoundUniques: {},
    dateFields: new Set(['expiresAt', 'createdAt', 'updatedAt']),
    hasUpdatedAt: true,
    relations: {},
  },
  PromoRedemption: {
    table: 'PromoRedemption',
    pk: 'id',
    uniqueFields: ['id'],
    compoundUniques: { userId_promoCodeId: ['userId', 'promoCodeId'] },
    dateFields: new Set(['redeemedAt', 'consumedAt']),
    hasUpdatedAt: false,
    relations: {
      user: { table: 'User', fk: 'userId', parentKey: 'id' },
      promoCode: { table: 'PromoCode', fk: 'promoCodeId', parentKey: 'id' },
    },
  },
};

export function getTableMeta(table: string): TableMeta {
  const meta = TABLE_META[table];
  if (!meta) throw new Error(`Unknown table meta: ${table}`);
  return meta;
}

function toIso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

function parseDateValue(value: unknown): unknown {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value);
  }
  return value;
}

export function parseRow<T extends Record<string, unknown>>(
  row: Record<string, unknown>,
  meta: TableMeta,
): T {
  const parsed: Record<string, unknown> = { ...row };
  for (const field of meta.dateFields) {
    if (field in parsed && parsed[field] != null) {
      parsed[field] = parseDateValue(parsed[field]);
    }
  }
  return parsed as T;
}

export function parseRows<T extends Record<string, unknown>>(
  rows: Record<string, unknown>[] | null,
  meta: TableMeta,
): T[] {
  return (rows ?? []).map((row) => parseRow<T>(row, meta));
}

export function resolveWhereKeys(where: Record<string, unknown>, meta: TableMeta): Record<string, unknown> {
  for (const [compoundKey, fields] of Object.entries(meta.compoundUniques)) {
    const compound = where[compoundKey];
    if (compound && typeof compound === 'object' && !Array.isArray(compound)) {
      const flat: Record<string, unknown> = { ...where };
      for (const field of fields) {
        flat[field] = (compound as Record<string, unknown>)[field];
      }
      delete flat[compoundKey];
      return flat;
    }
  }
  return where;
}

function applyFieldFilter(
  query: QueryBuilder,
  field: string,
  value: unknown,
): QueryBuilder {
  if (value === undefined) return query;

  if (value === null) {
    return query.is(field, null);
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    return query.eq(field, value as never);
  }

  const filter = value as Record<string, unknown>;

  if ('equals' in filter && filter.equals !== undefined) {
    return query.eq(field, filter.equals as never);
  }
  if ('not' in filter) {
    const notVal = filter.not;
    if (notVal === null) return query.not(field, 'is', null);
    if (typeof notVal === 'object' && notVal !== null && 'not' in notVal) {
      return query.neq(field, (notVal as { not: unknown }).not as never);
    }
    return query.neq(field, notVal as never);
  }
  if ('in' in filter && Array.isArray(filter.in)) {
    return query.in(field, filter.in as never[]);
  }
  if ('notIn' in filter && Array.isArray(filter.notIn)) {
    const values = filter.notIn as unknown[];
    if (values.length === 0) return query;
    const list = values.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',');
    return query.not(field, 'in', `(${list})`);
  }
  if ('contains' in filter && typeof filter.contains === 'string') {
    return query.like(field, `%${filter.contains}%`);
  }
  if ('gte' in filter && filter.gte !== undefined) {
    return query.gte(field, toIso(filter.gte as Date | string));
  }
  if ('lte' in filter && filter.lte !== undefined) {
    return query.lte(field, toIso(filter.lte as Date | string));
  }
  if ('gt' in filter && filter.gt !== undefined) {
    return query.gt(field, toIso(filter.gt as Date | string));
  }
  if ('lt' in filter && filter.lt !== undefined) {
    return query.lt(field, toIso(filter.lt as Date | string));
  }

  return query.eq(field, value as never);
}

export function applyWhere(
  query: QueryBuilder,
  where: Record<string, unknown> | undefined,
  meta: TableMeta,
): QueryBuilder {
  if (!where) return query;

  const resolved = resolveWhereKeys(where, meta);

  if (Array.isArray(resolved.OR)) {
    const parts: string[] = [];
    // Values are interpolated into the PostgREST `.or()` filter string, so
    // every value must be URL-encoded: an unencoded `,` would inject extra OR
    // branches (filter injection). Wildcards for `like` are added outside the
    // encoded value so they survive encoding.
    const enc = (v: unknown) => encodeURIComponent(String(v));
    for (const branch of resolved.OR as Record<string, unknown>[]) {
      for (const [field, val] of Object.entries(branch)) {
        if (val === undefined) continue;
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          const f = val as Record<string, unknown>;
          if ('equals' in f) parts.push(`${field}.eq.${enc(f.equals)}`);
          else if ('contains' in f) parts.push(`${field}.like.%${enc(f.contains)}%`);
        } else {
          parts.push(`${field}.eq.${enc(val)}`);
        }
      }
    }
    if (parts.length > 0) {
      query = query.or(parts.join(','));
    }
  }

  for (const [key, value] of Object.entries(resolved)) {
    if (key === 'OR' || value === undefined) continue;

    const relation = meta.relations[key];
    if (relation && typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const relFilter = value as Record<string, unknown>;
      if ('some' in relFilter && relFilter.some) {
        throw new Error(
          `${meta.table}.${key}.some relation filters are not supported — query the relation table directly`,
        );
      }
      continue;
    }

    query = applyFieldFilter(query, key, value);
  }

  return query;
}

export function applyOrderBy<T extends Record<string, unknown>>(
  query: QueryBuilder,
  orderBy?: OrderBy<T>,
): QueryBuilder {
  if (!orderBy) return query;

  const entries = Array.isArray(orderBy) ? orderBy : [orderBy];
  for (const entry of entries) {
    for (const [field, direction] of Object.entries(entry)) {
      query = query.order(field, { ascending: direction !== 'desc' });
    }
  }
  return query;
}

export function columnsFromSelect(select?: SelectFields): string[] | null {
  if (!select) return null;
  const cols: string[] = [];
  for (const [key, val] of Object.entries(select)) {
    if (val === true) cols.push(key);
  }
  return cols.length > 0 ? cols : null;
}

export function mergeSelectInclude(
  select?: SelectFields,
  include?: IncludeShape,
): { topLevel: string[] | null; relations: IncludeShape } {
  const relations: IncludeShape = { ...(include ?? {}) };

  if (select) {
    for (const [key, val] of Object.entries(select)) {
      if (val === true) continue;
      if (typeof val === 'object' && val !== null) {
        relations[key] = val as IncludeShape[string];
      }
    }
  }

  const topLevel = select ? columnsFromSelect(select) : null;
  return { topLevel, relations };
}

export async function attachRelations<T extends Record<string, unknown>>(
  rows: T[],
  relations: IncludeShape,
  meta: TableMeta,
): Promise<T[]> {
  if (rows.length === 0 || Object.keys(relations).length === 0) return rows;

  const parentIds = rows.map((row) => String(row[meta.pk]));

  for (const [relationName, spec] of Object.entries(relations)) {
    if (!spec) continue;
    const relationDef = meta.relations[relationName];
    if (!relationDef) continue;

    const opts = typeof spec === 'object' ? spec : {};
    const nestedWhere = opts.where ?? {};
    const nestedSelect = opts.select;
    const nestedOrderBy = opts.orderBy;
    const nestedTake = opts.take;

    // Project the relation query to the requested columns plus the fk used
    // for matching. Rows are still picked to the requested columns below,
    // so the returned shape is unchanged — only the transfer shrinks.
    const childCols = nestedSelect
      ? [...new Set([...(columnsFromSelect(nestedSelect) ?? []), relationDef.fk])]
      : null;
    let childQuery = rasoiDb()
      .from(relationDef.table)
      .select(childCols ? childCols.join(',') : '*')
      .in(relationDef.fk, parentIds);
    for (const [key, val] of Object.entries(nestedWhere)) {
      childQuery = applyFieldFilter(childQuery, key, val);
    }
    childQuery = applyOrderBy(childQuery, nestedOrderBy as OrderBy<Record<string, unknown>>);
    if (nestedTake) childQuery = childQuery.limit(nestedTake);

    const { data, error } = await childQuery;
    throwIfError(error, `${meta.table}.${relationName}`);

    const childMeta = getTableMeta(relationDef.table);
    let children = parseRows<Record<string, unknown>>(data, childMeta);

    if (nestedSelect) {
      const allowed = columnsFromSelect(nestedSelect);
      if (allowed) {
        children = children.map((child) => {
          const picked: Record<string, unknown> = {};
          for (const col of allowed) picked[col] = child[col];
          return picked;
        });
      }
    }

    const byParent = new Map<string, Record<string, unknown>[]>();
    for (const child of children) {
      const pid = String(child[relationDef.fk]);
      const list = byParent.get(pid) ?? [];
      list.push(child);
      byParent.set(pid, list);
    }

    for (const row of rows) {
      (row as Record<string, unknown>)[relationName] = byParent.get(String(row[meta.pk])) ?? [];
    }
  }

  return rows;
}

export async function attachParentRelations<T extends Record<string, unknown>>(
  rows: T[],
  relations: IncludeShape,
  meta: TableMeta,
): Promise<T[]> {
  if (rows.length === 0) return rows;

  for (const [relationName, spec] of Object.entries(relations)) {
    if (!spec) continue;
    const relationDef = meta.relations[relationName];
    if (!relationDef) continue;

    const fkValues = [
      ...new Set(
        rows
          .map((row) => row[relationDef.fk])
          .filter((v): v is string => typeof v === 'string' && v.length > 0),
      ),
    ];
    if (fkValues.length === 0) {
      for (const row of rows) {
        (row as Record<string, unknown>)[relationName] = null;
      }
      continue;
    }

    const opts = typeof spec === 'object' ? spec : {};
    const nestedSelect = opts.select;
    const parentKey = relationDef.parentKey ?? 'id';

    // Same projection as child relations: requested columns plus the key
    // used for matching. The pick below still trims to requested columns.
    const parentCols = nestedSelect
      ? [...new Set([...(columnsFromSelect(nestedSelect) ?? []), parentKey])]
      : null;
    const parentQuery = rasoiDb()
      .from(relationDef.table)
      .select(parentCols ? parentCols.join(',') : '*')
      .in(parentKey, fkValues);

    const { data, error } = await parentQuery;
    throwIfError(error, `${meta.table}.${relationName}`);

    const parentMeta = getTableMeta(relationDef.table);
    let parents = parseRows<Record<string, unknown>>(data, parentMeta);

    if (nestedSelect) {
      const allowed = columnsFromSelect(nestedSelect);
      if (allowed) {
        parents = parents.map((parent) => {
          const picked: Record<string, unknown> = {};
          for (const col of allowed) picked[col] = parent[col];
          return picked;
        });
      }
    }

    const byId = new Map(parents.map((p) => [String(p[parentKey]), p]));
    for (const row of rows) {
      const fk = row[relationDef.fk];
      (row as Record<string, unknown>)[relationName] =
        typeof fk === 'string' ? (byId.get(fk) ?? null) : null;
    }
  }

  return rows;
}

export function aggregateGroupBy<T extends string>(
  rows: Record<string, unknown>[],
  by: T[],
): Array<Record<T, string> & { _count: { _all: number } }> {
  const counts = new Map<string, { key: Record<string, string>; count: number }>();

  for (const row of rows) {
    const keyObj: Record<string, string> = {};
    for (const field of by) {
      keyObj[field] = String(row[field] ?? '');
    }
    const keyStr = JSON.stringify(keyObj);
    const existing = counts.get(keyStr);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(keyStr, { key: keyObj, count: 1 });
    }
  }

  return Array.from(counts.values()).map(({ key, count }) => ({
    ...(key as Record<T, string>),
    _count: { _all: count },
  }));
}

export function pickColumns<T extends Record<string, unknown>>(
  row: T,
  cols: string[] | null,
): Partial<T> | T {
  if (!cols) return row;
  const picked: Record<string, unknown> = {};
  for (const col of cols) {
    if (col in row) picked[col] = row[col];
  }
  return picked as Partial<T>;
}

export function serializeWriteData(
  data: Record<string, unknown>,
  meta: TableMeta,
  mode: 'create' | 'update',
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...data };
  const now = new Date().toISOString();

  for (const field of meta.dateFields) {
    if (field in out && out[field] instanceof Date) {
      out[field] = out[field].toISOString();
    }
  }

  if (mode === 'create' && meta.dateFields.has('createdAt') && out.createdAt === undefined) {
    out.createdAt = now;
  }

  if (meta.hasUpdatedAt) {
    out.updatedAt = now;
  }

  return out;
}

export function onConflictColumns(meta: TableMeta, where: Record<string, unknown>): string {
  const resolved = resolveWhereKeys(where, meta);
  for (const fields of Object.values(meta.compoundUniques)) {
    if (fields.every((f) => resolved[f] !== undefined)) {
      return fields.join(',');
    }
  }
  if (resolved[meta.pk] !== undefined) return meta.pk;
  for (const field of meta.uniqueFields) {
    if (field !== meta.pk && resolved[field] !== undefined) return field;
  }
  return meta.pk;
}

export function upsertPayload(
  create: Record<string, unknown>,
  update: Record<string, unknown>,
): Record<string, unknown> {
  return { ...create, ...update };
}

