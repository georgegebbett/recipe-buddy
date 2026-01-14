import { db as defaultDb } from "~/server/db"
import { apiKeys } from "~/server/db/schema"
import { eq } from "drizzle-orm"

interface ListApiKeysParams {
  db: typeof defaultDb
  userId: number
}

export async function listApiKeys({ db = defaultDb, userId }: ListApiKeysParams) {
  const keys = await db.query.apiKeys.findMany({
    where: eq(apiKeys.userId, userId),
    columns: {
      id: true,
      name: true,
      key: true,
      createdAt: true,
      lastUsedAt: true,
    },
  })

  return keys
}
