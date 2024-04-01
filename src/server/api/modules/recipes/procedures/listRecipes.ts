import { protectedProcedure } from "~/server/api/trpc"
import { db } from "~/server/db"
import { recipes as recipeTable } from "~/server/db/schema"
import z from "zod"

export const listRecipesProcedure = protectedProcedure
  .output(
    z
      .object({
        id: z.number(),
        name: z.string(),
        imageUrl: z.string().nullable(),
      })
      .array()
  )
  .query(async () => {
    return db
      .select({
        id: recipeTable.id,
        name: recipeTable.name,
        imageUrl: recipeTable.imageUrl,
      })
      .from(recipeTable)
  })
