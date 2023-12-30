import { hydrateRecipe } from "~/server/api/modules/recipes/service/scraper"
import { protectedProcedure } from "~/server/api/trpc"
import { db } from "~/server/db"
import { ingredients as ingredientsTable, recipes } from "~/server/db/schema"
import z from "zod"

import { logger } from "~/lib/logger"

export const scrapeRecipeProcedure = protectedProcedure
  .input(
    z.object({
      url: z.string().url(),
    })
  )
  .mutation(async ({ input }) => {
    const { url } = input

    const { recipe, ingredients } = await hydrateRecipe(url)

    const dbRecipe = await db.insert(recipes).values({
      ...recipe,
    })

    ingredients.map(
      async (a) =>
        await db.insert(ingredientsTable).values({
          scrapedName: a.scrapedName,
          recipeId: dbRecipe.lastInsertRowid.valueOf() as number,
        })
    )

    logger.info({ recipe, ingredients }, "Recipe added")

    return url
  })
