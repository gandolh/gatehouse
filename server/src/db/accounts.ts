import { mkdirSync } from "node:fs";
import { join } from "node:path";
import Database from "better-sqlite3";
import { createAccounts, createSqliteStore, type Accounts } from "../../vendor/ward/ward-auth.js";

/**
 * Gatehouse's one SQLite file, in the data folder. It holds only Ward's library's tables (`auth_users`,
 * `auth_sessions`, `auth_ward_links`, tracked in `auth_migrations`), which the library migrates itself when the store
 * is made: Gatehouse keeps no data of its own. Deleting it signs everyone out and forgets who has signed in.
 */
const DATABASE_FILE = "gatehouse.sqlite";

/** The accounts on the open database, and the way to close it. */
export interface AccountsDb {
  accounts: Accounts;
  close(): void;
}

/** Opens (or creates) the database in `dataDir`, migrates the library's tables, and makes the accounts on it. */
export function openAccounts(dataDir: string): AccountsDb {
  mkdirSync(dataDir, { recursive: true });
  const db = new Database(join(dataDir, DATABASE_FILE));
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return { accounts: createAccounts({ store: createSqliteStore(db) }), close: () => db.close() };
}
