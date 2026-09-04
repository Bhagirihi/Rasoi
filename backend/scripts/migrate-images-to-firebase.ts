/**
 * Migrate catalog image URLs from Supabase Postgres → Firebase Storage.
 *
 * Context: Rasoi does NOT store binary images in Supabase Storage today.
 * Recipe / kitchen / sponsor / announcement images are HTTPS URLs in Postgres
 * (mostly Unsplash). This script:
 *   1. Reads those URL columns
 *   2. Downloads each unique remote image once
 *   3. Uploads to Firebase Storage under catalog/
 *   4. Updates Postgres rows to the Firebase public URL
 *
 * Optional: also copy any files found in Supabase Storage buckets
 * (manifest only — no automatic DB rewrite for Storage-only objects).
 *
 * Usage (from Rasoi/backend):
 *   npm run db:migrate-images-firebase:dry
 *   npm run db:migrate-images-firebase
 *   npm run db:migrate-images-firebase -- --limit=20
 *   npm run db:migrate-images-firebase -- --tables=Recipe,KitchenStyle
 *   npm run db:migrate-images-firebase -- --include-supabase-storage
 *
 * Required env (backend/.env):
 *   DATABASE_URL or DIRECT_URL / SUPABASE_DB_PASSWORD + SUPABASE_PROJECT_REF
 *   FIREBASE_SERVICE_ACCOUNT_JSON  — raw JSON string of a service account
 *     OR FIREBASE_SERVICE_ACCOUNT_PATH — path to the JSON file
 *   FIREBASE_STORAGE_BUCKET — default: rasoi-app-prod.firebasestorage.app
 *
 * Optional:
 *   NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY — for --include-supabase-storage
 *
 * Before running for real:
 *   - Enable Firebase Storage in the Firebase console
 *   - Deploy public-read rules for catalog/** (see storage.rules.catalog.example)
 *   - Confirm Unsplash / source license allows re-hosting if applicable
 */

import 'dotenv/config';

import { createHash } from 'crypto';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

import { createClient } from '@supabase/supabase-js';
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { Pool } from 'pg';

import { getDirectDatabaseUrl } from '../src/lib/database-url';

type ImageColumn = {
  label: string;
  table: string;
  idColumn: string;
  urlColumn: string;
  folder: string;
  nullable?: boolean;
};

type RowRef = {
  table: string;
  id: string;
  urlColumn: string;
  sourceUrl: string;
};

const IMAGE_COLUMNS: ImageColumn[] = [
  {
    label: 'Recipe',
    table: 'Recipe',
    idColumn: 'id',
    urlColumn: 'imageUrl',
    folder: 'recipes',
  },
  {
    label: 'KitchenStyle',
    table: 'KitchenStyle',
    idColumn: 'id',
    urlColumn: 'heroImage',
    folder: 'kitchen-styles',
  },
  {
    label: 'Sponsor',
    table: 'Sponsor',
    idColumn: 'id',
    urlColumn: 'logoUrl',
    folder: 'sponsors',
  },
  {
    label: 'HomeAnnouncement',
    table: 'HomeAnnouncement',
    idColumn: 'id',
    urlColumn: 'imageUrl',
    folder: 'announcements',
    nullable: true,
  },
];

const dryRun = process.argv.includes('--dry-run');
const includeSupabaseStorage = process.argv.includes('--include-supabase-storage');
const concurrency = Number(argValue('--concurrency') ?? '4');
const limit = argValue('--limit') ? Number(argValue('--limit')) : null;
const tablesFilter = new Set(
  (argValue('--tables') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
);

function argValue(flag: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`${flag}=`));
  return hit ? hit.slice(flag.length + 1) : undefined;
}

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

function isAlreadyFirebase(url: string): boolean {
  const u = url.toLowerCase();
  return (
    u.includes('firebasestorage.googleapis.com') ||
    u.includes('storage.googleapis.com/') ||
    u.includes('.firebasestorage.app')
  );
}

function loadServiceAccount(): Record<string, unknown> {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (json) {
    return JSON.parse(json) as Record<string, unknown>;
  }

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
    'Missing Firebase credentials. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH (or place firebase-service-account.json in backend/).',
  );
}

function initFirebase(): { app: App; bucketName: string } {
  const sa = loadServiceAccount();
  const bucketName =
    process.env.FIREBASE_STORAGE_BUCKET?.trim() ||
    (typeof sa.storageBucket === 'string' ? sa.storageBucket : '') ||
    'rasoi-app-prod.firebasestorage.app';

  const app =
    getApps()[0] ??
    initializeApp({
      credential: cert(sa as Parameters<typeof cert>[0]),
      storageBucket: bucketName,
    });

  return { app, bucketName };
}

function extensionFromContentType(contentType: string | null, url: string): string {
  const ct = (contentType ?? '').toLowerCase();
  if (ct.includes('png')) return 'png';
  if (ct.includes('webp')) return 'webp';
  if (ct.includes('gif')) return 'gif';
  if (ct.includes('jpeg') || ct.includes('jpg')) return 'jpg';
  const path = new URL(url).pathname.toLowerCase();
  const m = path.match(/\.(png|jpe?g|webp|gif)(?:$|\?)/i);
  if (m) return m[1].toLowerCase().replace('jpeg', 'jpg');
  return 'jpg';
}

function contentTypeForExt(ext: string): string {
  switch (ext) {
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    default:
      return 'image/jpeg';
  }
}

function hashUrl(url: string): string {
  return createHash('sha256').update(url).digest('hex').slice(0, 24);
}

function firebasePublicUrl(bucketName: string, objectPath: string): string {
  const encoded = encodeURIComponent(objectPath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encoded}?alt=media`;
}

async function downloadImage(
  url: string,
): Promise<{ buffer: Buffer; contentType: string; ext: string }> {
  const res = await fetch(url, {
    headers: {
      // Unsplash and many CDNs prefer a real User-Agent
      'User-Agent': 'RasoiImageMigrator/1.0 (+https://rasoiapplication.in)',
      Accept: 'image/*,*/*',
    },
    redirect: 'follow',
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} downloading ${url}`);
  }
  const contentType = res.headers.get('content-type');
  const ext = extensionFromContentType(contentType, url);
  const ab = await res.arrayBuffer();
  return {
    buffer: Buffer.from(ab),
    contentType: contentType?.split(';')[0]?.trim() || contentTypeForExt(ext),
    ext,
  };
}

async function mapPool<T, R>(
  items: T[],
  limitN: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i], i);
    }
  }
  const runners = Array.from({ length: Math.max(1, limitN) }, () => run());
  await Promise.all(runners);
  return results;
}

async function loadRows(pool: Pool): Promise<RowRef[]> {
  const columns = IMAGE_COLUMNS.filter(
    (c) => tablesFilter.size === 0 || tablesFilter.has(c.table),
  );
  const rows: RowRef[] = [];

  for (const col of columns) {
    const sql = `
      SELECT "${col.idColumn}" AS id, "${col.urlColumn}" AS url
      FROM rasoi."${col.table}"
      WHERE "${col.urlColumn}" IS NOT NULL
        AND btrim("${col.urlColumn}") <> ''
      ORDER BY "${col.idColumn}"
    `;
    const { rows: dbRows } = await pool.query<{ id: string; url: string }>(sql);
    for (const r of dbRows) {
      const sourceUrl = r.url.trim();
      if (!isHttpUrl(sourceUrl)) {
        console.warn(`[skip] ${col.table}/${r.id}: not an http(s) URL`);
        continue;
      }
      if (isAlreadyFirebase(sourceUrl)) {
        continue;
      }
      rows.push({
        table: col.table,
        id: r.id,
        urlColumn: col.urlColumn,
        sourceUrl,
      });
    }
    console.log(
      `Loaded ${dbRows.length} ${col.label} rows with ${col.urlColumn} (pending migrate: ${rows.filter((x) => x.table === col.table).length})`,
    );
  }

  return rows;
}

async function migrateDbUrls(
  pool: Pool,
  bucketName: string,
): Promise<{ migrated: number; failed: number }> {
  let rows = await loadRows(pool);
  if (limit != null && Number.isFinite(limit)) {
    rows = rows.slice(0, limit);
    console.log(`--limit=${limit} → processing ${rows.length} row refs`);
  }

  // Dedupe by source URL so shared Unsplash photos upload once
  const byUrl = new Map<string, RowRef[]>();
  for (const row of rows) {
    const list = byUrl.get(row.sourceUrl) ?? [];
    list.push(row);
    byUrl.set(row.sourceUrl, list);
  }

  console.log(
    `Unique remote URLs to migrate: ${byUrl.size} (covering ${rows.length} rows)`,
  );

  const folderByTable = new Map(IMAGE_COLUMNS.map((c) => [c.table, c.folder]));
  let migrated = 0;
  let failed = 0;

  const entries = Array.from(byUrl.entries());
  await mapPool(entries, concurrency, async ([sourceUrl, refs], index) => {
    const primary = refs[0];
    const folder = folderByTable.get(primary.table) ?? 'misc';
    const objectBase = `catalog/${folder}/${hashUrl(sourceUrl)}`;

    try {
      if (dryRun) {
        console.log(
          `[dry-run ${index + 1}/${entries.length}] ${sourceUrl} → gs://${bucketName}/${objectBase}.* (${refs.length} rows)`,
        );
        migrated += refs.length;
        return;
      }

      const { buffer, contentType, ext } = await downloadImage(sourceUrl);
      const objectPath = `${objectBase}.${ext}`;
      const bucket = getStorage().bucket(bucketName);
      const file = bucket.file(objectPath);

      await file.save(buffer, {
        resumable: false,
        contentType,
        metadata: {
          cacheControl: 'public,max-age=31536000,immutable',
          metadata: {
            sourceUrl,
            migratedAt: new Date().toISOString(),
          },
        },
      });

      // Prefer ACL public URL when allowed; Storage rules should also allow read.
      try {
        await file.makePublic();
      } catch {
        // Uniform bucket-level access: public via rules + alt=media URL is fine
      }

      const publicUrl = firebasePublicUrl(bucketName, objectPath);

      for (const ref of refs) {
        await pool.query(
          `UPDATE rasoi."${ref.table}"
           SET "${ref.urlColumn}" = $1, "updatedAt" = NOW()
           WHERE id = $2`,
          [publicUrl, ref.id],
        );
      }

      migrated += refs.length;
      console.log(
        `[ok ${index + 1}/${entries.length}] ${refs.length} row(s) → ${publicUrl}`,
      );
    } catch (error) {
      failed += refs.length;
      const message = error instanceof Error ? error.message : String(error);
      console.error(
        `[fail ${index + 1}/${entries.length}] ${sourceUrl}: ${message}`,
      );
    }
  });

  return { migrated, failed };
}

async function copySupabaseStorageBuckets(bucketName: string): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    console.warn(
      'Skipping Supabase Storage scan: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY',
    );
    return;
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    console.warn('Could not list Supabase Storage buckets:', error.message);
    return;
  }
  if (!buckets?.length) {
    console.log('No Supabase Storage buckets found (expected for current Rasoi setup).');
    return;
  }

  console.log(`Found ${buckets.length} Supabase Storage bucket(s).`);
  const fbBucket = getStorage().bucket(bucketName);

  for (const bucket of buckets) {
    console.log(`Scanning supabase://${bucket.name}`);
    const { data: files, error: listError } = await supabase.storage
      .from(bucket.name)
      .list('', { limit: 1000 });
    if (listError) {
      console.warn(`  list failed: ${listError.message}`);
      continue;
    }

    for (const file of files ?? []) {
      if (!file.name || file.id == null) continue;
      // list() is shallow; for nested folders you'd recurse — fine for a first pass
      const path = file.name;
      const { data: blob, error: dlError } = await supabase.storage
        .from(bucket.name)
        .download(path);
      if (dlError || !blob) {
        console.warn(`  download failed ${path}: ${dlError?.message}`);
        continue;
      }

      const dest = `from-supabase-storage/${bucket.name}/${path}`;
      if (dryRun) {
        console.log(`  [dry-run] ${path} → gs://${bucketName}/${dest}`);
        continue;
      }

      const buffer = Buffer.from(await blob.arrayBuffer());
      await fbBucket.file(dest).save(buffer, {
        resumable: false,
        metadata: {
          cacheControl: 'public,max-age=31536000',
          metadata: { supabaseBucket: bucket.name, supabasePath: path },
        },
      });
      console.log(`  uploaded ${dest}`);
    }
  }
}

async function main() {
  console.log('Rasoi image migration → Firebase Storage');
  console.log(dryRun ? 'Mode: DRY RUN (no uploads / no DB writes)' : 'Mode: LIVE');
  console.log(`Concurrency: ${concurrency}`);

  const { bucketName } = initFirebase();
  console.log(`Firebase bucket: ${bucketName}`);

  const pool = new Pool({ connectionString: getDirectDatabaseUrl() });

  try {
    const result = await migrateDbUrls(pool, bucketName);
    console.log('\nDB URL migration summary');
    console.log(`  migrated/planned rows: ${result.migrated}`);
    console.log(`  failed rows:           ${result.failed}`);

    if (includeSupabaseStorage) {
      console.log('\nSupabase Storage copy');
      await copySupabaseStorageBuckets(bucketName);
    }

    if (!dryRun) {
      console.log(`
Next steps:
  1. Deploy Storage rules so catalog/** is publicly readable.
  2. Spot-check a few recipes in the app / admin.
  3. Keep seed scripts from rewriting imageUrl back to Unsplash
     (or re-run this migrator after seeds).
`);
    }
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
