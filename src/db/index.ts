import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Conexão criada apenas na primeira consulta: o build e o deploy funcionam sem
// DATABASE_URL, e cada rota decide como tratar a ausência do banco em runtime.
const globalForDb = globalThis as typeof globalThis & {
  __reaBrasilPg?: { pool: Pool; db: NodePgDatabase };
};

function getDatabase(): NodePgDatabase {
  if (!globalForDb.__reaBrasilPg) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is required");
    }
    const pool = new Pool({
      connectionString: databaseUrl,
      // Neon encerra conexões ociosas; mantenha o pool pequeno e curto.
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
    globalForDb.__reaBrasilPg = { pool, db: drizzle(pool) };
  }
  return globalForDb.__reaBrasilPg.db;
}

export type Database = NodePgDatabase;

export const db: NodePgDatabase = new Proxy({} as NodePgDatabase, {
  get(_target, property) {
    const database = getDatabase();
    const value = Reflect.get(database as object, property, database);
    return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(database) : value;
  },
});
