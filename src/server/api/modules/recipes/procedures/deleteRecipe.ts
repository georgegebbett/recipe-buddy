import { deleteRecipe } from "~/server/api/modules/recipes/service/deleteRecipe"
import { protectedProcedure } from "~/server/api/trpc"
import { z } from "zod"

export const deleteRecipeProcedure = protectedProcedure
  .input(
    z.object({
      recipeId: z.number(),
    })
  )
  .mutation(({ input }) => deleteRecipe(input.recipeId))
