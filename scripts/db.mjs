import fs from "node:fs/promises";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const command = process.argv[2];
if (command === "migrate") {
  const sql = await fs.readFile(new URL("../db/migrations/001_initial.sql", import.meta.url), "utf8");
  await pool.query("CREATE EXTENSION IF NOT EXISTS pgcrypto");
  await pool.query(sql);
} else if (command === "seed") {
  const sql = await fs.readFile(new URL("../db/seed.sql", import.meta.url), "utf8");
  await pool.query(sql);
} else {
  throw new Error("Use migrate or seed.");
}
await pool.end();
