import { scrapeRecipeProcedure } from "~/server/api/modules/recipes/procedures/scrapeRecipe"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"
import { z } from "zod"
import {listRecipesProcedure} from "~/server/api/modules/recipes/procedures/listRecipes";
import {getRecipeByIdProcedure} from "~/server/api/modules/recipes/procedures/getById";

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
  get: getRecipeByIdProcedure
})
