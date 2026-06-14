import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

import { getDirectDatabaseUrl } from './src/lib/database-url';

dotenv.config({ override: true });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: getDirectDatabaseUrl(),
  },
});
