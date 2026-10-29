import 'dotenv/config';

import { db } from '../src/lib/db';
import { syncPublicKitchenStyle } from '../src/lib/sync-public-kitchen-style';

async function main() {
  const styles = await db.kitchenStyle.findMany({ orderBy: { sortOrder: 'asc' } });
  for (const style of styles) {
    await syncPublicKitchenStyle(style);
    console.log(`Synced ${style.id}: ${style.label}`);
  }
  console.log(`Done — ${styles.length} kitchen styles synced to public.cuisines`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
