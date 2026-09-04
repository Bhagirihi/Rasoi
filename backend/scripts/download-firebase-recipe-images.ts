/**
 * Download all images from Supabase Storage bucket `downloads`:
 *   - recipe-assets/
 *   - recipes/
 *
 * Usage (from Rasoi/backend):
 *   npm run db:download-recipe-images
 *   npm run db:download-recipe-images -- --dry-run
 *   npm run db:download-recipe-images -- --list-only
 *   npm run db:download-recipe-images -- --out=/path/to/folder
 *   npm run db:download-recipe-images -- --force
 */

import 'dotenv/config';

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const BUCKET = 'downloads';
const FOLDERS = ['recipe-assets', 'recipes'] as const;
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|heic|heif|avif|bmp|svg|tiff?)$/i;
const PAGE_SIZE = 1000;

const dryRun = process.argv.includes('--dry-run');
const listOnly = process.argv.includes('--list-only');
const force = process.argv.includes('--force');
const concurrency = Math.max(1, Number(argValue('--concurrency') ?? '12'));
const outDir = resolve(
  argValue('--out') ?? join(process.cwd(), '../../recipe-images'),
);

function argValue(flag: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`${flag}=`));
  return hit ? hit.slice(flag.length + 1) : undefined;
}

function createStorage(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error(
      'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env',
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function publicUrl(objectPath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, '');
  return `${base}/storage/v1/object/public/${BUCKET}/${objectPath
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`;
}

function isImagePath(path: string): boolean {
  return IMAGE_EXT.test(path);
}

async function listLevel(
  supabase: SupabaseClient,
  prefix: string,
): Promise<{ files: string[]; folders: string[] }> {
  const files: string[] = [];
  const folders: string[] = [];
  let offset = 0;

  for (;;) {
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
      limit: PAGE_SIZE,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (error) {
      throw new Error(`List failed for ${prefix || '/'}: ${error.message}`);
    }
    if (!data?.length) break;

    for (const item of data) {
      if (!item.name || item.name === '.emptyFolderPlaceholder') continue;
      const path = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id == null) folders.push(path);
      else files.push(path);
    }

    if (data.length < PAGE_SIZE) break;
    offset += data.length;
  }

  return { files, folders };
}

async function listFolderRecursive(
  supabase: SupabaseClient,
  root: string,
): Promise<string[]> {
  const images: string[] = [];
  const queue = [root];

  while (queue.length) {
    const prefix = queue.shift()!;
    const { files, folders } = await listLevel(supabase, prefix);
    for (const file of files) {
      if (isImagePath(file)) images.push(file);
    }
    queue.push(...folders);
  }

  return images;
}

async function mapPool<T>(
  items: T[],
  limitN: number,
  worker: (item: T, index: number) => Promise<void>,
): Promise<void> {
  let next = 0;
  async function run() {
    while (next < items.length) {
      const i = next++;
      await worker(items[i], i);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limitN, Math.max(items.length, 1)) }, () =>
      run(),
    ),
  );
}

async function downloadFile(objectPath: string, dest: string): Promise<void> {
  mkdirSync(dirname(dest), { recursive: true });
  const res = await fetch(publicUrl(objectPath));
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buffer);
}

async function main() {
  const supabase = createStorage();
  console.log(`Bucket: ${BUCKET}`);
  console.log(`Output: ${outDir}`);
  console.log(
    dryRun || listOnly ? 'Mode: DRY / LIST (no downloads)' : 'Mode: DOWNLOAD',
  );

  const byFolder: Record<string, string[]> = {};
  let total = 0;

  for (const folder of FOLDERS) {
    mkdirSync(join(outDir, folder), { recursive: true });
    const images = await listFolderRecursive(supabase, folder);
    byFolder[folder] = images;
    total += images.length;
    console.log(`  ${folder}/: ${images.length} image(s)`);
  }

  if (!total) {
    console.log('No images found.');
    return;
  }

  const jobs = FOLDERS.flatMap((folder) => byFolder[folder]);

  if (listOnly) {
    for (const path of jobs.slice(0, 40)) console.log(`  ${path}`);
    if (jobs.length > 40) console.log(`  … ${jobs.length - 40} more`);
    console.log(`List-only complete — ${jobs.length} image(s).`);
    return;
  }

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  const started = Date.now();

  await mapPool(jobs, concurrency, async (objectPath, index) => {
    const dest = join(outDir, objectPath);
    try {
      if (!force && existsSync(dest)) {
        skipped += 1;
        return;
      }
      if (dryRun) {
        downloaded += 1;
        return;
      }
      await downloadFile(objectPath, dest);
      downloaded += 1;
      if ((index + 1) % 250 === 0 || index + 1 === jobs.length) {
        const elapsed = ((Date.now() - started) / 1000).toFixed(0);
        console.log(
          `[${index + 1}/${jobs.length}] downloaded ${downloaded}, skipped ${skipped}, failed ${failed} (${elapsed}s)`,
        );
      }
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[fail] ${objectPath}: ${message}`);
    }
  });

  console.log(
    `Done — downloaded ${downloaded}, skipped ${skipped}, failed ${failed}, total ${jobs.length}.`,
  );
  console.log(`Saved under ${outDir}`);
  console.log(`  ${join(outDir, 'recipe-assets')}`);
  console.log(`  ${join(outDir, 'recipes')}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
