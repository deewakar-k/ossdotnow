import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '@workspace/env/server';
import postgres from 'postgres';
import 'server-only';

import { upstashCache } from 'drizzle-orm/cache/upstash';
import * as schema from './schema';

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL, { prepare: false });
if (env.VERCEL_ENV !== 'production') globalForDb.conn = conn;

export const db = drizzle(conn, {
  schema,
  cache: upstashCache({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  }),
});
export type DB = typeof db;
