import { type Config } from "drizzle-kit"

import { env } from "./src/env"

export default {
  schema: "./src/server/db/schema.ts",
  driver: "better-sqlite",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["recipe-buddy_*"],
  out: "./src/server/db/drizzle",
} satisfies Config
