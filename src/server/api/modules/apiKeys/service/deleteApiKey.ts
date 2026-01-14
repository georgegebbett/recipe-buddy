import { db as defaultDb } from "~/server/db"
import { apiKeys } from "~/server/db/schema"
import { and, eq } from "drizzle-orm"
import { TRPCError } from "@trpc/server"

interface DeleteApiKeyParams {
  db: typeof defaultDb
  userId: number
  apiKeyId: number
}

export async function deleteApiKey({
  db = defaultDb,
  userId,
  apiKeyId,
}: DeleteApiKeyParams) {
  // Verify the API key belongs to the user
  const apiKey = await db.query.apiKeys.findFirst({
    where: and(eq(apiKeys.id, apiKeyId), eq(apiKeys.userId, userId)),
  })

  if (!apiKey) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "API key not found",
    })
  }

  await db.delete(apiKeys).where(eq(apiKeys.id, apiKeyId))

  return { success: true }
}
