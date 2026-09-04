/**
 * Export all published recipe titles from Supabase.
 *
 *   npx tsx scripts/export-all-recipe-titles.ts
 */
import 'dotenv/config';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Pool } from 'pg';

import { getDirectDatabaseUrl } from '../src/lib/database-url';

const pool = new Pool({ connectionString: getDirectDatabaseUrl() });

type Row = {
  id: string;
  title: string;
  kitchenStyleId: string;
  region: string;
  dietType: string;
};

async function main() {
  const { rows } = await pool.query<Row>(
    `SELECT id, title, "kitchenStyleId", region, "dietType"
     FROM rasoi."Recipe"
     WHERE published = true
     ORDER BY title ASC, id ASC`,
  );

  const root = join(__dirname, '..', '..');
  const csvPath = join(root, 'docs', 'ALL_RECIPE_TITLES.csv');
  const jsonPath = join(root, 'docs', 'ALL_RECIPE_TITLES.json');
  const mdPath = join(root, 'docs', 'ALL_RECIPE_TITLES.md');
  const txtPath = join(root, 'docs', 'ALL_RECIPE_TITLES.txt');

  const esc = (s: string) => `"${String(s ?? '').replace(/"/g, '""')}"`;
  const csvLines = ['id,title,kitchenStyleId,region,dietType'];
  for (const r of rows) {
    csvLines.push([r.id, r.title, r.kitchenStyleId, r.region, r.dietType].map(esc).join(','));
  }

  writeFileSync(csvPath, `${csvLines.join('\n')}\n`);
  writeFileSync(
    jsonPath,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), total: rows.length, recipes: rows }, null, 2)}\n`,
  );
  writeFileSync(txtPath, `${rows.map((r) => r.title).join('\n')}\n`);

  const mdLines = [
    '# All recipe titles (Supabase)',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Total published recipes: **${rows.length}**`,
    '',
    '| # | ID | Title | Kitchen | Region | Diet |',
    '|---:|---|---|---|---|---|',
  ];
  for (let i = 0; i < rows.length; i += 1) {
    const r = rows[i];
    mdLines.push(
      `| ${i + 1} | ${r.id} | ${r.title.replace(/\|/g, '\\|')} | ${r.kitchenStyleId} | ${r.region} | ${r.dietType} |`,
    );
  }
  writeFileSync(mdPath, `${mdLines.join('\n')}\n`);

  console.log(`Exported ${rows.length} recipe titles`);
  console.log(`Wrote ${csvPath}`);
  console.log(`Wrote ${jsonPath}`);
  console.log(`Wrote ${mdPath}`);
  console.log(`Wrote ${txtPath}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
