/**
 * Upload local unique recipe images to Firebase Storage, point Recipe.imageUrl
 * at Firebase, then optionally delete them from Supabase Storage.
 *
 * App fetch: Rasoi mobile already loads recipe.imageUrl as a full HTTPS URL.
 * No app code change is required once Postgres URLs are Firebase.
 *
 * Objects land at: catalog/recipes/{filename}
 * (public-read path in scripts/storage.rules.catalog.example)
 *
 * Usage (from Rasoi/backend):
 *   npx tsx scripts/upload-unique-to-firebase.ts --dry-run
 *   npx tsx scripts/upload-unique-to-firebase.ts --live
 *   npx tsx scripts/upload-unique-to-firebase.ts --live --delete-supabase
 *
 * Required:
 *   FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH
 *   or App/fcm-service-account.json / backend/firebase-service-account.json
 *   FIREBASE_STORAGE_BUCKET (default rasoi-app-prod.firebasestorage.app)
 *   NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (for --delete-supabase)
 *
 * Deploy Storage rules so catalog/** is publicly readable before --live.
 */

import 'dotenv/config';

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

import { createClient } from '@supabase/supabase-js';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { Pool } from 'pg';

import { getPooledDatabaseUrl } from '../src/lib/database-url';

const UNIQUE_DIR =
  '/Users/dhruvdave/Dhurv/Test/untitled folder/recipe-images/unique';
const OBJECT_PREFIX = 'catalog/recipes';
const SUPABASE_BUCKET = 'downloads';
const SUPABASE_PREFIX = 'recipes';

const dryRun = !process.argv.includes('--live');
const deleteSupabase = process.argv.includes('--delete-supabase');
const concurrency = Math.max(1, Number(argValue('--concurrency') ?? '6'));

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

function uniqueFiles(): string[] {
  return readdirSync(UNIQUE_DIR).filter(
    (f) => !f.startsWith('_') && !f.endsWith('.json'),
  );
}

function loadServiceAccount(): Record<string, unknown> {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (json) return JSON.parse(json) as Record<string, unknown>;

  const pathEnv = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();
  const candidates = [
    pathEnv,
    resolve(process.cwd(), 'firebase-service-account.json'),
    resolve(process.cwd(), '../App/fcm-service-account.json'),
  ].filter(Boolean) as string[];

  for (const path of candidates) {
    if (existsSync(path)) {
      return JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>;
    }
  }

  throw new Error(
    'Missing Firebase credentials. Save the Admin JSON as Rasoi/App/fcm-service-account.json (gitignored) or set FIREBASE_SERVICE_ACCOUNT_PATH.',
  );
}

function initFirebase(): string {
  const sa = loadServiceAccount();
  const bucketName =
    process.env.FIREBASE_STORAGE_BUCKET?.trim() ||
    (typeof sa.storageBucket === 'string' ? sa.storageBucket : '') ||
    'rasoi-app-prod.firebasestorage.app';

  if (!getApps().length) {
    initializeApp({
      credential: cert(sa as Parameters<typeof cert>[0]),
      storageBucket: bucketName,
    });
  }
  return bucketName;
}

function firebasePublicUrl(bucketName: string, objectPath: string): string {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(objectPath)}?alt=media`;
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

function filenameFromSupabaseUrl(url: string): string | null {
  const marker = '/downloads/recipes/';
  const i = url.indexOf(marker);
  if (i < 0) return null;
  return decodeURIComponent(url.slice(i + marker.length).split('?')[0]);
}

async function listSupabase(prefix: string): Promise<string[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error('Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to delete Supabase files');
  }
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const files: string[] = [];
  const queue = [prefix];
  while (queue.length) {
    const current = queue.shift()!;
    let offset = 0;
    for (;;) {
      const { data, error } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .list(current, {
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

async function deleteSupabaseFiles(paths: string[]): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!.trim();
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  for (let i = 0; i < paths.length; i += 100) {
    const chunk = paths.slice(i, i + 100);
    const { error } = await supabase.storage.from(SUPABASE_BUCKET).remove(chunk);
    if (error) throw new Error(`remove: ${error.message}`);
    if ((i + chunk.length) % 500 === 0 || i + chunk.length === paths.length) {
      console.log(`  deleted supabase ${i + chunk.length}/${paths.length}`);
    }
  }
}

async function main() {
  console.log(dryRun ? 'Mode: DRY RUN' : 'Mode: LIVE');
  const files = uniqueFiles();
  console.log(`Unique local images: ${files.length}`);

  const bucketName = initFirebase();
  const bucket = getStorage().bucket(bucketName);
  console.log(`Firebase bucket: ${bucketName}`);
  console.log(`Object prefix: ${OBJECT_PREFIX}/`);

  const pool = new Pool({ connectionString: getPooledDatabaseUrl() });
  const { rows } = await pool.query<{ id: string; imageUrl: string }>(
    `SELECT id, "imageUrl" FROM rasoi."Recipe"
     WHERE "imageUrl" ILIKE '%/downloads/recipes/%'`,
  );

  const uniqueSet = new Set(files);
  let rewrites = 0;
  let missingFile = 0;
  for (const row of rows) {
    const name = filenameFromSupabaseUrl(row.imageUrl);
    if (!name || !uniqueSet.has(name)) missingFile += 1;
    else rewrites += 1;
  }
  console.log(
    `Recipe rows on Supabase downloads: ${rows.length} (mappable ${rewrites}, missing local file ${missingFile})`,
  );
  if (missingFile) {
    throw new Error(`${missingFile} recipe URL(s) have no matching file in unique/`);
  }

  if (dryRun) {
    console.log(`Would upload ${files.length} files to gs://${bucketName}/${OBJECT_PREFIX}/`);
    console.log(`Would rewrite ${rows.length} recipe imageUrl rows`);
    if (deleteSupabase) console.log('Would then delete Supabase downloads/recipes/');
    await pool.end();
    return;
  }

  let uploaded = 0;
  let failed = 0;
  const started = Date.now();
  await mapPool(files, concurrency, async (name, index) => {
    const objectPath = `${OBJECT_PREFIX}/${name}`;
    try {
      await bucket.file(objectPath).save(readFileSync(join(UNIQUE_DIR, name)), {
        resumable: false,
        contentType: contentType(name),
        metadata: {
          cacheControl: 'public,max-age=31536000,immutable',
        },
      });
      try {
        await bucket.file(objectPath).makePublic();
      } catch {
        // Uniform bucket-level access: public via Storage rules + alt=media
      }
      uploaded += 1;
      if ((index + 1) % 250 === 0 || index + 1 === files.length) {
        const s = ((Date.now() - started) / 1000).toFixed(0);
        console.log(
          `[upload ${index + 1}/${files.length}] ok ${uploaded} fail ${failed} (${s}s)`,
        );
      }
    } catch (e) {
      failed += 1;
      console.error(`[fail] ${name}: ${e instanceof Error ? e.message : e}`);
    }
  });
  if (failed) throw new Error(`Upload failed for ${failed} file(s) — DB not rewritten`);

  const probe = firebasePublicUrl(bucketName, `${OBJECT_PREFIX}/${files[0]}`);
  const probeRes = await fetch(probe, { method: 'HEAD' });
  console.log(`Public-read probe: ${probeRes.status} ${files[0]}`);
  if (!probeRes.ok) {
    throw new Error(
      `Firebase URL is not publicly readable (HTTP ${probeRes.status}). Deploy storage rules for catalog/** then re-run. DB not rewritten.`,
    );
  }

  console.log(`Rewriting ${rows.length} recipe imageUrl rows…`);
  let updated = 0;
  for (const row of rows) {
    const name = filenameFromSupabaseUrl(row.imageUrl)!;
    const next = firebasePublicUrl(bucketName, `${OBJECT_PREFIX}/${name}`);
    if (next === row.imageUrl) continue;
    await pool.query(
      `UPDATE rasoi."Recipe" SET "imageUrl" = $1, "updatedAt" = NOW() WHERE id = $2`,
      [next, row.id],
    );
    updated += 1;
    if (updated % 500 === 0) console.log(`  updated ${updated}`);
  }
  console.log(`Recipe URLs rewritten: ${updated}/${rows.length}`);

  if (deleteSupabase) {
    console.log('Deleting Supabase downloads/recipes/ …');
    const remote = await listSupabase(SUPABASE_PREFIX);
    await deleteSupabaseFiles(remote);
    console.log(`Deleted ${remote.length} Supabase objects`);
  } else {
    console.log('Skipped Supabase delete (pass --delete-supabase after verifying the app).');
  }

  await pool.end();
  console.log('Done.');
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
