import 'dotenv/config';
import { Pool } from 'pg';
import { getDirectDatabaseUrl } from '../src/lib/database-url';

async function main() {
  const pool = new Pool({ connectionString: getDirectDatabaseUrl() });
  const rasoi = await pool.query('SELECT COUNT(*)::int AS c FROM rasoi."Recipe"');
  const pub = await pool.query('SELECT COUNT(*)::int AS c FROM public.recipes');
  console.log('rasoi.Recipe:', rasoi.rows[0].c);
  console.log('public.recipes:', pub.rows[0].c);
  await pool.end();
}

main();
