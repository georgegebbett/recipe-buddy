import { db as defaultDb } from "~/server/db"
import { apiKeys } from "~/server/db/schema"
import { v4 as uuidv4 } from "uuid"

interface GenerateApiKeyParams {
  db: typeof defaultDb
  userId: number
  name: string
}

export async function generateApiKey({
  db = defaultDb,
  userId,
  name,
}: GenerateApiKeyParams) {
  // Generate a secure random API key
  const key = `rbk_${uuidv4().replace(/-/g, "")}`

  const [apiKey] = await db
    .insert(apiKeys)
    .values({
      name,
      key,
      userId,
      createdAt: new Date(),
    })
    .returning()

  return {
    id: apiKey!.id,
    name: apiKey!.name,
    key: apiKey!.key,
    createdAt: apiKey!.createdAt,
  }
}
