import { db } from "~/server/db"
import { recipes } from "~/server/db/schema"
import { eq } from "drizzle-orm"

import { logger } from "~/lib/logger"

export const deleteRecipe = (recipeId: number) => {
  logger.info(`Deleting recipe with ID ${recipeId}`)

  return db.delete(recipes).where(eq(recipes.id, recipeId))
}
