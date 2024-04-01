import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"

import * as schema from "./schema.js"

export const sqlite = new Database(process.env.DATABASE_URL ?? "")
export const db = drizzle(sqlite, { schema })

await migrate(db, { migrationsFolder: "./migrations/drizzle" })

await sqlite.close()
