import { Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import { type DB } from "./types";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL が設定されていません。");
  throw new Error("DATABASE_URL が設定されていません。");
}

const dialect = new MysqlDialect({
  pool: createPool(databaseUrl),
});

export const db = new Kysely<DB>({
  dialect,
});
