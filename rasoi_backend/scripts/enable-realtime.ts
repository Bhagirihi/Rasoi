import 'dotenv/config';
import pg from 'pg';

import { RASOI_REALTIME_TABLES } from '../src/lib/realtime-tables';
import { getDirectDatabaseUrl } from '../src/lib/database-url';

const SETUP_STATEMENTS = [
  'GRANT USAGE ON SCHEMA rasoi TO anon, authenticated',
  'GRANT SELECT ON ALL TABLES IN SCHEMA rasoi TO anon, authenticated',
  'ALTER DEFAULT PRIVILEGES IN SCHEMA rasoi GRANT SELECT ON TABLES TO anon, authenticated',
];

async function addTablesToPublication(client: pg.Client) {
  try {
    await client.query('ALTER PUBLICATION supabase_realtime ADD TABLES IN SCHEMA rasoi');
    console.log('Added all rasoi tables to supabase_realtime publication.');
    return;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes('already member') && !message.includes('duplicate')) {
      console.warn('Schema-wide publication add failed, trying per-table:', message);
    }
  }

  for (const table of RASOI_REALTIME_TABLES) {
    try {
      await client.query(`ALTER PUBLICATION supabase_realtime ADD TABLE rasoi."${table}"`);
      console.log(`Added rasoi.${table} to supabase_realtime.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('already member')) {
        console.log(`rasoi.${table} already in supabase_realtime.`);
      } else {
        throw error;
      }
    }
  }
}

async function main() {
  const client = new pg.Client({ connectionString: getDirectDatabaseUrl() });
  await client.connect();

  for (const statement of SETUP_STATEMENTS) {
    await client.query(statement);
    console.log(`OK: ${statement}`);
  }

  await addTablesToPublication(client);
  await client.end();
  console.log('Realtime setup complete. Admin UI will refresh when rasoi data changes.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
