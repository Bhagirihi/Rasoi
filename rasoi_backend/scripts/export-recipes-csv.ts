/**
 * Export rasoi."Recipe" to CSV (includes descriptionHi, stepsHi).
 * Usage: npx tsx scripts/export-recipes-csv.ts [output-path]
 */
import 'dotenv/config';
import { writeFileSync } from 'node:fs';
import { Pool } from 'pg';

import { getDirectDatabaseUrl } from '../src/lib/database-url';

function csvEscape(value: string | null | undefined): string {
  const text = value ?? '';
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

async function main() {
  const outPath =
    process.argv[2] ??
    '/Users/dhruvdave/Downloads/Recipe_rows_updated.csv';

  const pool = new Pool({ connectionString: getDirectDatabaseUrl() });
  const { rows } = await pool.query(`
    SELECT *
    FROM rasoi."Recipe"
    ORDER BY id
  `);
  await pool.end();

  if (rows.length === 0) {
    console.error('No recipes found.');
    process.exit(1);
  }

  const columns = Object.keys(rows[0]);
  const lines = [columns.join(',')];
  for (const row of rows) {
    lines.push(columns.map((col) => csvEscape(String(row[col] ?? ''))).join(','));
  }

  writeFileSync(outPath, lines.join('\n'), 'utf8');
  console.log(`Exported ${rows.length} recipes to ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
