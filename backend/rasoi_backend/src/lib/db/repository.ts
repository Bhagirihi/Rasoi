import { createRowId, rasoiDb } from '@/lib/db/client';
import { throwIfError } from '@/lib/db/errors';
import {
  aggregateGroupBy,
  applyOrderBy,
  applyWhere,
  attachParentRelations,
  attachRelations,
  getTableMeta,
  mergeSelectInclude,
  onConflictColumns,
  parseRow,
  parseRows,
  pickColumns,
  resolveWhereKeys,
  serializeWriteData,
  upsertPayload,
  type TableMeta,
} from '@/lib/db/query';
import type { BatchPayload, IncludeShape, OrderBy, SelectFields } from '@/lib/db/types';

type FindArgs = {
  where?: Record<string, unknown>;
  select?: SelectFields;
  include?: IncludeShape;
  orderBy?: OrderBy<Record<string, unknown>>;
  take?: number;
  skip?: number;
};

type CreateArgs = { data: Record<string, unknown> };
type UpdateArgs = { where: Record<string, unknown>; data: Record<string, unknown> };
type DeleteArgs = { where: Record<string, unknown> };
type UpsertArgs = {
  where: Record<string, unknown>;
  create: Record<string, unknown>;
  update: Record<string, unknown>;
};

type GroupByArgs = {
  by: string[];
  where?: Record<string, unknown>;
  _count?: { _all?: boolean };
};

function childRelations(meta: TableMeta, relations: IncludeShape): IncludeShape {
  const out: IncludeShape = {};
  for (const [name, spec] of Object.entries(relations)) {
    const def = meta.relations[name];
    if (def && !def.parentKey) out[name] = spec;
  }
  return out;
}

function parentRelations(meta: TableMeta, relations: IncludeShape): IncludeShape {
  const out: IncludeShape = {};
  for (const [name, spec] of Object.entries(relations)) {
    const def = meta.relations[name];
    if (def?.parentKey) out[name] = spec;
  }
  return out;
}

async function finalizeRows<T extends Record<string, unknown>>(
  rows: T[],
  meta: TableMeta,
  topLevel: string[] | null,
  relations: IncludeShape,
): Promise<T[]> {
  let result = rows.map((row) => pickColumns(row, topLevel) as T);
  result = await attachRelations(result, childRelations(meta, relations), meta);
  result = await attachParentRelations(result, parentRelations(meta, relations), meta);
  return result;
}

export function createRepository<T extends Record<string, unknown>>(tableName: string) {
  const meta = getTableMeta(tableName);

  return {
    async findUnique(args: FindArgs): Promise<T | null> {
      const { topLevel, relations } = mergeSelectInclude(args.select, args.include);
      // Project the requested columns into the PostgREST query instead of
      // fetching '*' and trimming in JS. Safe: pickColumns already trims
      // returned rows to topLevel today, so callers never see more than
      // these fields. Relations need the pk/fk on the row for attachment
      // (finalizeRows picks before attaching), so keep '*' when any
      // relation is requested.
      const hasRelations = Object.keys(relations).length > 0;
      const selectCols = topLevel && !hasRelations ? topLevel.join(',') : '*';
      let query = rasoiDb().from(meta.table).select(selectCols);
      query = applyWhere(query, args.where, meta);
      const { data, error } = await query.maybeSingle();
      throwIfError(error, `${meta.table}.findUnique`);
      if (!data) return null;
      const row = parseRow<T>(data as Record<string, unknown>, meta);
      const [final] = await finalizeRows([row], meta, topLevel, relations);
      return final;
    },

    async findFirst(args: FindArgs = {}): Promise<T | null> {
      const rows = await this.findMany({ ...args, take: 1 });
      return rows[0] ?? null;
    },

    async findMany(args: FindArgs = {}): Promise<T[]> {
      const { topLevel, relations } = mergeSelectInclude(args.select, args.include);
      // Same projection rule as findUnique: only when no relations are
      // attached, so pk/fk columns needed for attachment are never dropped.
      const hasRelations = Object.keys(relations).length > 0;
      const selectCols = topLevel && !hasRelations ? topLevel.join(',') : '*';
      let query = rasoiDb().from(meta.table).select(selectCols);
      query = applyWhere(query, args.where, meta);
      query = applyOrderBy(query, args.orderBy);
      if (args.skip != null && args.take != null) {
        query = query.range(args.skip, args.skip + args.take - 1);
      } else if (args.take != null) {
        query = query.limit(args.take);
      }

      const { data, error } = await query;
      throwIfError(error, `${meta.table}.findMany`);
      const rows = parseRows<T>(data as Record<string, unknown>[] | null, meta);
      return finalizeRows(rows, meta, topLevel, relations);
    },

    async create(args: CreateArgs): Promise<T> {
      const payload = serializeWriteData({ ...args.data }, meta, 'create');
      if (!payload[meta.pk] && meta.pk === 'id') {
        payload[meta.pk] = createRowId();
      }

      const { data, error } = await rasoiDb()
        .from(meta.table)
        .insert(payload)
        .select('*')
        .single();

      throwIfError(error, `${meta.table}.create`);
      return parseRow<T>(data as Record<string, unknown>, meta);
    },

    async update(args: UpdateArgs): Promise<T> {
      const payload = serializeWriteData({ ...args.data }, meta, 'update');
      let query = rasoiDb().from(meta.table).update(payload);
      query = applyWhere(query, args.where, meta);

      const { data, error } = await query.select('*').single();
      throwIfError(error, `${meta.table}.update`);
      return parseRow<T>(data as Record<string, unknown>, meta);
    },

    async updateMany(args: UpdateArgs): Promise<BatchPayload> {
      const payload = serializeWriteData({ ...args.data }, meta, 'update');
      let query = rasoiDb().from(meta.table).update(payload);
      query = applyWhere(query, args.where, meta);

      const { data, error } = await query.select(meta.pk);
      throwIfError(error, `${meta.table}.updateMany`);
      return { count: (data ?? []).length };
    },

    async delete(args: DeleteArgs): Promise<T> {
      let query = rasoiDb().from(meta.table).delete();
      query = applyWhere(query, args.where, meta);

      const { data, error } = await query.select('*').single();
      throwIfError(error, `${meta.table}.delete`);
      return parseRow<T>(data as Record<string, unknown>, meta);
    },

    async deleteMany(args: { where?: Record<string, unknown> } = {}): Promise<BatchPayload> {
      let query = rasoiDb().from(meta.table).delete();
      query = applyWhere(query, args.where, meta);

      const { data, error } = await query.select(meta.pk);
      throwIfError(error, `${meta.table}.deleteMany`);
      return { count: (data ?? []).length };
    },

    async count(args: { where?: Record<string, unknown> } = {}): Promise<number> {
      let query = rasoiDb().from(meta.table).select('*', { count: 'exact', head: true });
      query = applyWhere(query, args.where, meta);

      const { count, error } = await query;
      throwIfError(error, `${meta.table}.count`);
      return count ?? 0;
    },

    async upsert(args: UpsertArgs): Promise<T> {
      const conflict = onConflictColumns(meta, args.where);
      const createData = serializeWriteData({ ...args.create }, meta, 'create');
      const updateData = serializeWriteData({ ...args.update }, meta, 'update');

      if (!createData[meta.pk] && meta.pk === 'id') {
        createData[meta.pk] = createRowId();
      }

      const resolvedWhere = resolveWhereKeys(args.where, meta);
      for (const [key, val] of Object.entries(resolvedWhere)) {
        if (createData[key] === undefined) createData[key] = val;
      }

      const payload = upsertPayload(createData, updateData);

      const { data, error } = await rasoiDb()
        .from(meta.table)
        .upsert(payload, { onConflict: conflict })
        .select('*')
        .single();

      throwIfError(error, `${meta.table}.upsert`);
      return parseRow<T>(data as Record<string, unknown>, meta);
    },

    async groupBy(args: GroupByArgs): Promise<Array<Record<string, string> & { _count: { _all: number } }>> {
      const selectCols = args.by.join(',');
      let query = rasoiDb().from(meta.table).select(selectCols);
      query = applyWhere(query, args.where, meta);

      const { data, error } = await query;
      throwIfError(error, `${meta.table}.groupBy`);
      return aggregateGroupBy((data ?? []) as unknown as Record<string, unknown>[], args.by);
    },
  };
}

export type Repository<T extends Record<string, unknown>> = ReturnType<typeof createRepository<T>>;

