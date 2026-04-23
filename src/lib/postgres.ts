import { Pool } from 'pg';

type GlobalWithPool = typeof globalThis & {
  __ebenesaidPool?: Pool;
};

const globalWithPool = globalThis as GlobalWithPool;

export const dbPool =
  globalWithPool.__ebenesaidPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== 'production') {
  globalWithPool.__ebenesaidPool = dbPool;
}
