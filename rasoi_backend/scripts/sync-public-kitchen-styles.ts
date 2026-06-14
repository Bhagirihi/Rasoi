import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

import { getDirectDatabaseUrl } from '../src/lib/database-url';
import { PrismaClient } from '../src/generated/prisma/client';
import { syncPublicKitchenStyle } from '../src/lib/sync-public-kitchen-style';

const pool = new Pool({ connectionString: getDirectDatabaseUrl() });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const styles = await prisma.kitchenStyle.findMany({ orderBy: { sortOrder: 'asc' } });
  for (const style of styles) {
    await syncPublicKitchenStyle(style);
    console.log(`Synced ${style.id}: ${style.label}`);
  }
  console.log(`Done — ${styles.length} kitchen styles synced to public.cuisines`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
