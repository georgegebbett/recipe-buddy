import { migrate } from "drizzle-orm/better-sqlite3/migrator"

import { db, sqlite } from "./index"

await migrate(db, { migrationsFolder: "./drizzle" })

await sqlite.close()
