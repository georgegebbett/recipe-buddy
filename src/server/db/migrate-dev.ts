import { dirname, join } from "path"
import { fileURLToPath } from "url"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"

import { db, sqlite } from "./index"

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = dirname(__filename)

const migrationsPath = join(__dirname, "drizzle")

await migrate(db, { migrationsFolder: migrationsPath })

await sqlite.close()
