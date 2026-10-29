import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

import { getDirectDatabaseUrl } from '../src/lib/database-url';

async function main() {
  const sqlPath = path.join(__dirname, 'bulk-sync-public-recipes.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const pool = new Pool({ connectionString: getDirectDatabaseUrl() });

  console.log('Running bulk public recipe sync…');
  const result = await pool.query(sql);
  const last = result.at(-1);
  if (last?.rows?.[0]) {
    console.log('Summary:', last.rows[0]);
  } else {
    console.log('Bulk sync completed.');
  }

  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
