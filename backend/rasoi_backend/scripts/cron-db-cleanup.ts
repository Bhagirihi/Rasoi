import 'dotenv/config';

import { runDbCleanup } from '../src/lib/db-cleanup';

async function main() {
  const result = await runDbCleanup();
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
