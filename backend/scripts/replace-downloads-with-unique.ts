/**
 * Replace Supabase Storage bucket `downloads` with unique compressed recipe images.
 *
 * 1. Delete unused `recipe-assets/`
 * 2. Upload `recipe-images/unique/` → `downloads/recipes/`
 * 3. Point rasoi."Recipe".imageUrl at the unique file for that photo
 * 4. Delete leftover duplicate objects under `recipes/`
 *
 * Usage (from Rasoi/backend):
 *   npx tsx scripts/replace-downloads-with-unique.ts --dry-run
 *   npx tsx scripts/replace-downloads-with-unique.ts --live
 */

import 'dotenv/config';

import { createHash } from 'crypto';
import {
  createReadStream,
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from 'fs';
import { basename, join } from 'path';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Pool } from 'pg';

import { getPooledDatabaseUrl } from '../src/lib/database-url';

const ROOT = '/Users/dhruvdave/Dhurv/Test/untitled folder/recipe-images';
const UNIQUE_DIR = join(ROOT, 'unique');
const ORIG_DIR = join(ROOT, 'recipes');
const BUCKET = 'downloads';
const PREFIX = 'recipes';
const PUBLIC_BASE =
  'https://ehrwhepgdrgbvjknyaeb.supabase.co/storage/v1/object/public/downloads/recipes';

const dryRun = !process.argv.includes('--live');
const concurrency = Math.max(1, Number(argValue('--concurrency') ?? '4'));

function argValue(flag: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`${flag}=`));
  return hit ? hit.slice(flag.length + 1) : undefined;
}

function contentType(name: string): string {
  const ext = name.slice(name.lastIndexOf('.') + 1).toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'avif') return 'image/avif';
  if (ext === 'svg') return 'image/svg+xml';
  return 'image/jpeg';
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function sha256(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const h = createHash('sha256');
    createReadStream(path)
      .on('data', (c) => h.update(c))
      .on('end', () => resolve(h.digest('hex')))
      .on('error', reject);
  });
}

async function mapPool<T, R>(
  items: T[],
  limitN: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limitN, Math.max(items.length, 1)) }, () =>
      run(),
    ),
  );
  return results;
}

function uniqueNameOnDisk(savedAs: string): string | null {
  if (existsSync(join(UNIQUE_DIR, savedAs))) return savedAs;
  if (savedAs.toLowerCase().endsWith('.png')) {
    const jpg = savedAs.replace(/\.png$/i, '.jpg');
    if (existsSync(join(UNIQUE_DIR, jpg))) return jpg;
  }
  return null;
}

async function buildOrigToUnique(): Promise<Map<string, string>> {
  const origFiles = walk(ORIG_DIR);
  const hashes = await mapPool(origFiles, 16, sha256);
  const byHash = new Map<string, string[]>();
  origFiles.forEach((p, i) => {
    const list = byHash.get(hashes[i]) ?? [];
    list.push(basename(p));
    byHash.set(hashes[i], list);
  });

  const origToUnique = new Map<string, string>();
  for (const names of byHash.values()) {
    const hit = names.map((n) => uniqueNameOnDisk(n)).find(Boolean);
    if (!hit) {
      throw new Error(`No unique file for originals: ${names.slice(0, 3).join(', ')}`);
    }
    for (const n of names) origToUnique.set(n, hit);
  }
  return origToUnique;
}

function createStorage(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function listAll(
  supabase: SupabaseClient,
  prefix: string,
): Promise<string[]> {
  const files: string[] = [];
  const queue = [prefix];
  while (queue.length) {
    const current = queue.shift()!;
    let offset = 0;
    for (;;) {
      const { data, error } = await supabase.storage.from(BUCKET).list(current, {
        limit: 1000,
        offset,
        sortBy: { column: 'name', order: 'asc' },
      });
      if (error) throw new Error(`list ${current}: ${error.message}`);
      if (!data?.length) break;
      for (const item of data) {
        if (!item.name || item.name === '.emptyFolderPlaceholder') continue;
        const path = current ? `${current}/${item.name}` : item.name;
        if (item.id == null) queue.push(path);
        else files.push(path);
      }
      if (data.length < 1000) break;
      offset += data.length;
    }
  }
  return files;
}

async function removeAll(supabase: SupabaseClient, paths: string[]): Promise<void> {
  for (let i = 0; i < paths.length; i += 100) {
    const chunk = paths.slice(i, i + 100);
    if (dryRun) continue;
    const { error } = await supabase.storage.from(BUCKET).remove(chunk);
    if (error) throw new Error(`remove: ${error.message}`);
    if ((i + chunk.length) % 500 === 0 || i + chunk.length === paths.length) {
      console.log(`  deleted ${i + chunk.length}/${paths.length}`);
    }
  }
}

function publicUrl(filename: string): string {
  return `${PUBLIC_BASE}/${encodeURIComponent(filename)}`;
}

async function main() {
  console.log(dryRun ? 'Mode: DRY RUN' : 'Mode: LIVE');
  const uniqueFiles = readdirSync(UNIQUE_DIR).filter(
    (f) => !f.startsWith('_') && !f.endsWith('.json'),
  );
  console.log(`Unique images to upload: ${uniqueFiles.length}`);

  console.log('Building original → unique filename map…');
  const origToUnique = await buildOrigToUnique();
  console.log(`Mapped ${origToUnique.size} original filenames`);

  const pool = new Pool({ connectionString: getPooledDatabaseUrl() });
  const { rows } = await pool.query<{ id: string; imageUrl: string }>(
    `SELECT id, "imageUrl" FROM rasoi."Recipe" WHERE "imageUrl" ILIKE '%/downloads/recipes/%'`,
  );

  const updates: { id: string; next: string }[] = [];
  for (const row of rows) {
    const raw = decodeURIComponent(row.imageUrl.split('/downloads/recipes/')[1] ?? '');
    const unique = origToUnique.get(raw);
    if (!unique) throw new Error(`No unique file for DB image: ${raw}`);
    const next = publicUrl(unique);
    if (next !== row.imageUrl) updates.push({ id: row.id, next });
  }
  console.log(`Recipe URLs to rewrite: ${updates.length}/${rows.length}`);

  const supabase = createStorage();

  console.log('Listing recipe-assets/ …');
  const assetPaths = await listAll(supabase, 'recipe-assets');
  console.log(`recipe-assets objects: ${assetPaths.length}`);
  if (assetPaths.length) {
    console.log(dryRun ? 'Would delete recipe-assets/' : 'Deleting recipe-assets/ …');
    await removeAll(supabase, assetPaths);
  }

  console.log(dryRun ? 'Would upload unique files…' : 'Uploading unique files…');
  let uploaded = 0;
  let failed = 0;
  const started = Date.now();
  await mapPool(uniqueFiles, concurrency, async (name, index) => {
    const path = `${PREFIX}/${name}`;
    try {
      if (!dryRun) {
        const body = readFileSync(join(UNIQUE_DIR, name));
        const { error } = await supabase.storage.from(BUCKET).upload(path, body, {
          upsert: true,
          contentType: contentType(name),
          cacheControl: 'public,max-age=31536000,immutable',
        });
        if (error) throw error;
      }
      uploaded += 1;
      if ((index + 1) % 250 === 0 || index + 1 === uniqueFiles.length) {
        const s = ((Date.now() - started) / 1000).toFixed(0);
        console.log(`[upload ${index + 1}/${uniqueFiles.length}] ok ${uploaded} fail ${failed} (${s}s)`);
      }
    } catch (e) {
      failed += 1;
      console.error(`[fail] ${name}: ${e instanceof Error ? e.message : e}`);
    }
  });
  if (failed) throw new Error(`Upload failed for ${failed} file(s)`);

  if (dryRun) {
    console.log(`Would update ${updates.length} recipe imageUrl rows`);
  } else {
    console.log(`Updating ${updates.length} recipe imageUrl rows…`);
    for (const u of updates) {
      await pool.query(
        `UPDATE rasoi."Recipe" SET "imageUrl" = $1, "updatedAt" = NOW() WHERE id = $2`,
        [u.next, u.id],
      );
    }
  }

  console.log('Listing recipes/ leftovers…');
  const remoteRecipes = await listAll(supabase, PREFIX);
  const keep = new Set(uniqueFiles.map((n) => `${PREFIX}/${n}`));
  const leftovers = remoteRecipes.filter((p) => !keep.has(p));
  console.log(`Remote recipes objects: ${remoteRecipes.length}, leftovers: ${leftovers.length}`);
  if (leftovers.length) {
    console.log(dryRun ? 'Would delete leftover duplicates' : 'Deleting leftover duplicates…');
    await removeAll(supabase, leftovers);
  }

  await pool.end();
  console.log('Done.');
  console.log(`  uploaded ${uploaded} unique images to ${BUCKET}/${PREFIX}/`);
  console.log(`  recipe URL rewrites ${updates.length}`);
  console.log(`  deleted recipe-assets ${assetPaths.length}, leftover recipes ${leftovers.length}`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
