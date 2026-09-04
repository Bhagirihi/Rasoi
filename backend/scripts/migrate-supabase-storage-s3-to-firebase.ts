/**
 * Migrate Supabase Storage objects → Firebase Storage (stream, one object at a time).
 *
 * Why S3: normal Storage API / public URLs return HTTP 402 exceed_storage_size_quota
 * on this project. Supabase S3-compatible API can still list/get objects when
 * Storage → Configuration → S3 access keys are set.
 *
 * Usage (from Rasoi/backend):
 *   npm run db:migrate-storage-s3-firebase:list
 *   npm run db:migrate-storage-s3-firebase:dry -- --limit=5
 *   npm run db:migrate-storage-s3-firebase -- --bucket=downloads
 *   npm run db:migrate-storage-s3-firebase -- --bucket=downloads --prefix=recipes/
 *
 * Required env (backend/.env) — never commit secrets:
 *   SUPABASE_S3_ACCESS_KEY_ID=
 *   SUPABASE_S3_SECRET_ACCESS_KEY=
 *   SUPABASE_S3_ENDPOINT=https://ehrwhepgdrgbvjknyaeb.storage.supabase.co/storage/v1/s3
 *   SUPABASE_S3_REGION=ap-southeast-2
 *   FIREBASE_SERVICE_ACCOUNT_PATH=../App/fcm-service-account.json
 *   # or FIREBASE_SERVICE_ACCOUNT_JSON='{...}'
 *   FIREBASE_STORAGE_BUCKET=rasoi-app-prod.firebasestorage.app
 *
 * Optional:
 *   DATABASE_URL / DIRECT_URL — to rewrite rasoi."Recipe"."imageUrl" etc after upload
 *   SUPABASE_PUBLIC_URL=https://ehrwhepgdrgbvjknyaeb.supabase.co
 *
 * Flags:
 *   --dry-run          list only / no upload / no DB write
 *   --list-only        list buckets + object counts then exit
 *   --bucket=NAME      only this bucket (default: all)
 *   --prefix=PATH      only keys under prefix
 *   --limit=N          stop after N successful uploads
 *   --concurrency=N    parallel transfers (default 2; keep low for 402/rate safety)
 *   --skip-db          do not update Postgres URLs
 *   --force            re-upload even if Firebase object already exists
 */

import 'dotenv/config';

import { createHash } from 'crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';

import {
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { Pool } from 'pg';

import { getDirectDatabaseUrl } from '../src/lib/database-url';

const dryRun = process.argv.includes('--dry-run');
const listOnly = process.argv.includes('--list-only');
const skipDb = process.argv.includes('--skip-db');
const force = process.argv.includes('--force');
const bucketFilter = argValue('--bucket');
const prefixFilter = argValue('--prefix') ?? '';
const limit = argValue('--limit') ? Number(argValue('--limit')) : null;
const concurrency = Math.max(1, Number(argValue('--concurrency') ?? '2'));

const CHECKPOINT_PATH = resolve(
  process.cwd(),
  'scripts/.migrate-storage-s3-firebase-checkpoint.json',
);

type Checkpoint = {
  done: Record<string, string>; // "bucket/key" → firebase public URL
  failed: Record<string, string>;
};

function argValue(flag: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`${flag}=`));
  return hit ? hit.slice(flag.length + 1) : undefined;
}

function requireEnv(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

function loadCheckpoint(): Checkpoint {
  if (!existsSync(CHECKPOINT_PATH)) return { done: {}, failed: {} };
  try {
    return JSON.parse(readFileSync(CHECKPOINT_PATH, 'utf8')) as Checkpoint;
  } catch {
    return { done: {}, failed: {} };
  }
}

function saveCheckpoint(cp: Checkpoint) {
  mkdirSync(dirname(CHECKPOINT_PATH), { recursive: true });
  writeFileSync(CHECKPOINT_PATH, JSON.stringify(cp, null, 2));
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

  for (const p of candidates) {
    if (existsSync(p)) {
      return JSON.parse(readFileSync(p, 'utf8')) as Record<string, unknown>;
    }
  }
  throw new Error(
    'Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON',
  );
}

function initFirebase(): string {
  const sa = loadServiceAccount();
  const bucketName =
    process.env.FIREBASE_STORAGE_BUCKET?.trim() ||
    'rasoi-app-prod.firebasestorage.app';

  if (!getApps().length) {
    initializeApp({
      credential: cert(sa as Parameters<typeof cert>[0]),
      storageBucket: bucketName,
    });
  }
  return bucketName;
}

function createS3(): S3Client {
  return new S3Client({
    region: process.env.SUPABASE_S3_REGION?.trim() || 'ap-southeast-2',
    endpoint:
      process.env.SUPABASE_S3_ENDPOINT?.trim() ||
      'https://ehrwhepgdrgbvjknyaeb.storage.supabase.co/storage/v1/s3',
    forcePathStyle: true,
    credentials: {
      accessKeyId: requireEnv('SUPABASE_S3_ACCESS_KEY_ID'),
      secretAccessKey: requireEnv('SUPABASE_S3_SECRET_ACCESS_KEY'),
    },
  });
}

function firebasePublicUrl(bucketName: string, objectPath: string): string {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(objectPath)}?alt=media`;
}

function supabasePublicUrl(bucket: string, key: string): string {
  const base = (
    process.env.SUPABASE_PUBLIC_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://ehrwhepgdrgbvjknyaeb.supabase.co'
  ).replace(/\/$/, '');
  return `${base}/storage/v1/object/public/${bucket}/${key}`;
}

function contentTypeForKey(key: string, header?: string): string {
  if (header?.includes('/')) return header.split(';')[0].trim();
  const lower = key.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  return 'application/octet-stream';
}

async function listAllKeys(
  s3: S3Client,
  bucket: string,
  prefix: string,
): Promise<Array<{ key: string; size: number }>> {
  const out: Array<{ key: string; size: number }> = [];
  let token: string | undefined;
  do {
    const res = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix || undefined,
        ContinuationToken: token,
        MaxKeys: 1000,
      }),
    );
    for (const obj of res.Contents ?? []) {
      if (!obj.Key || obj.Key.endsWith('/')) continue;
      out.push({ key: obj.Key, size: Number(obj.Size ?? 0) });
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);
  return out;
}

async function mapPool<T>(
  items: T[],
  limitN: number,
  worker: (item: T) => Promise<void>,
): Promise<void> {
  let next = 0;
  async function run() {
    while (next < items.length) {
      const i = next++;
      await worker(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limitN, items.length) }, () => run()));
}

async function rewriteDbUrls(
  pool: Pool,
  oldUrl: string,
  newUrl: string,
): Promise<number> {
  const tables: Array<{ table: string; col: string }> = [
    { table: 'Recipe', col: 'imageUrl' },
    { table: 'KitchenStyle', col: 'heroImage' },
    { table: 'Sponsor', col: 'logoUrl' },
    { table: 'HomeAnnouncement', col: 'imageUrl' },
  ];
  let total = 0;
  for (const t of tables) {
    const { rowCount } = await pool.query(
      `UPDATE rasoi."${t.table}"
       SET "${t.col}" = $1, "updatedAt" = NOW()
       WHERE "${t.col}" = $2`,
      [newUrl, oldUrl],
    );
    total += rowCount ?? 0;
  }
  return total;
}

async function main() {
  console.log('Supabase Storage (S3) → Firebase Storage');
  console.log(
    dryRun || listOnly
      ? 'Mode: DRY / LIST (no uploads)'
      : 'Mode: LIVE stream migrate',
  );

  const s3 = createS3();
  const fbBucketName = initFirebase();
  const fbBucket = getStorage().bucket(fbBucketName);
  const checkpoint = loadCheckpoint();

  console.log('Firebase bucket:', fbBucketName);
  console.log('S3 endpoint:', process.env.SUPABASE_S3_ENDPOINT);

  const listed = await s3.send(new ListBucketsCommand({}));
  const buckets = (listed.Buckets ?? [])
    .map((b) => b.Name)
    .filter((n): n is string => Boolean(n))
    .filter((n) => !bucketFilter || n === bucketFilter);

  if (!buckets.length) {
    throw new Error(
      bucketFilter
        ? `Bucket "${bucketFilter}" not found via S3`
        : 'No buckets returned — check S3 keys / endpoint / region',
    );
  }

  console.log('Buckets:', buckets.join(', '));

  type Job = { bucket: string; key: string; size: number };
  const jobs: Job[] = [];
  let totalBytes = 0;

  for (const bucket of buckets) {
    const keys = await listAllKeys(s3, bucket, prefixFilter);
    console.log(
      `  ${bucket}${prefixFilter ? `/${prefixFilter}` : ''}: ${keys.length} objects`,
    );
    for (const k of keys) {
      jobs.push({ bucket, key: k.key, size: k.size });
      totalBytes += k.size;
    }
  }

  console.log(
    `Total objects: ${jobs.length} · ~${(totalBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`,
  );

  if (listOnly) {
    console.log('List-only complete.');
    return;
  }

  let pool: Pool | null = null;
  if (!skipDb && !dryRun) {
    try {
      pool = new Pool({ connectionString: getDirectDatabaseUrl() });
    } catch (e) {
      console.warn(
        'DB URL rewrite disabled (no DB connection):',
        e instanceof Error ? e.message : e,
      );
    }
  }

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;
  let dbRewrites = 0;
  let processed = 0;

  const pending = jobs.filter((j) => {
    const id = `${j.bucket}/${j.key}`;
    if (!force && checkpoint.done[id]) {
      skipped += 1;
      return false;
    }
    return true;
  });

  const work =
    limit != null && Number.isFinite(limit) ? pending.slice(0, limit) : pending;

  console.log(
    `To process: ${work.length} (skipped already-done: ${skipped}, concurrency: ${concurrency})`,
  );

  await mapPool(work, concurrency, async (job) => {
    const id = `${job.bucket}/${job.key}`;
    const destPath = `from-supabase/${job.bucket}/${job.key}`;
    const oldPublic = supabasePublicUrl(job.bucket, job.key);

    try {
      if (dryRun) {
        console.log(`[dry-run] ${id} (${job.size} B) → gs://${fbBucketName}/${destPath}`);
        uploaded += 1;
        processed += 1;
        return;
      }

      if (!force) {
        const [exists] = await fbBucket.file(destPath).exists();
        if (exists) {
          const publicUrl = firebasePublicUrl(fbBucketName, destPath);
          checkpoint.done[id] = publicUrl;
          saveCheckpoint(checkpoint);
          if (pool) {
            dbRewrites += await rewriteDbUrls(pool, oldPublic, publicUrl);
          }
          skipped += 1;
          processed += 1;
          console.log(`[skip-exists] ${id}`);
          return;
        }
      }

      const got = await s3.send(
        new GetObjectCommand({ Bucket: job.bucket, Key: job.key }),
      );
      if (!got.Body) throw new Error('Empty S3 body');

      const bytes = Buffer.from(await got.Body.transformToByteArray());
      const contentType = contentTypeForKey(
        job.key,
        got.ContentType ?? undefined,
      );

      const file = fbBucket.file(destPath);
      await file.save(bytes, {
        resumable: false,
        contentType,
        metadata: {
          cacheControl: 'public,max-age=31536000,immutable',
          metadata: {
            source: 'supabase-s3',
            supabaseBucket: job.bucket,
            supabaseKey: job.key,
            sha256: createHash('sha256').update(bytes).digest('hex'),
            migratedAt: new Date().toISOString(),
          },
        },
      });

      try {
        await file.makePublic();
      } catch {
        // Uniform bucket ACL — rely on Storage rules public read
      }

      const publicUrl = firebasePublicUrl(fbBucketName, destPath);
      checkpoint.done[id] = publicUrl;
      delete checkpoint.failed[id];
      saveCheckpoint(checkpoint);

      if (pool) {
        dbRewrites += await rewriteDbUrls(pool, oldPublic, publicUrl);
      }

      uploaded += 1;
      processed += 1;
      console.log(`[ok ${processed}/${work.length}] ${id} → ${publicUrl}`);
    } catch (error) {
      failed += 1;
      processed += 1;
      const message = error instanceof Error ? error.message : String(error);
      checkpoint.failed[id] = message;
      saveCheckpoint(checkpoint);
      console.error(`[fail] ${id}: ${message}`);
    }
  });

  if (pool) await pool.end();

  console.log('\nSummary');
  console.log(`  uploaded/planned: ${uploaded}`);
  console.log(`  skipped:          ${skipped}`);
  console.log(`  failed:           ${failed}`);
  console.log(`  DB URL rewrites:  ${dbRewrites}`);
  console.log(`  checkpoint:       ${CHECKPOINT_PATH}`);
  console.log(`
Next:
  1. Deploy Storage rules so from-supabase/** is publicly readable
     (see scripts/storage.rules.catalog.example — extend path).
  2. Spot-check a recipe image in the app.
  3. Re-run this command to resume failures (checkpoint skips done keys).
  4. Only then free Supabase Storage / fix quota.
`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
