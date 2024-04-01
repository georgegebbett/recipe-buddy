import { deleteRecipeProcedure } from "~/server/api/modules/recipes/procedures/deleteRecipe"
import { getRecipeByIdProcedure } from "~/server/api/modules/recipes/procedures/getById"
import { listRecipesProcedure } from "~/server/api/modules/recipes/procedures/listRecipes"
import { scrapeRecipeProcedure } from "~/server/api/modules/recipes/procedures/scrapeRecipe"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"
import { z } from "zod"

export const recipeRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      }
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!"
  }),
  scrape: scrapeRecipeProcedure,
  list: listRecipesProcedure,
  get: getRecipeByIdProcedure,
  delete: deleteRecipeProcedure,
})
