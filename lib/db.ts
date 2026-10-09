import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { getDatabaseUrl } from "@/lib/env";

const globalForDb = globalThis as unknown as { pool?: Pool };

export function getPool() {
  if (!globalForDb.pool) {
    globalForDb.pool = new Pool({
      connectionString: getDatabaseUrl(),
      max: Number(process.env.DB_POOL_MAX ?? 10),
      idleTimeoutMillis: 30_000,
    });
  }
  return globalForDb.pool;
}

export async function query<T extends QueryResultRow>(text: string, values: unknown[] = []) {
  return getPool().query<T>(text, values);
}

export async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>) {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
