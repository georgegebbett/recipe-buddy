import { scrapeRecipeProcedure } from "~/server/api/modules/recipes/procedures/scrapeRecipe"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"
import { z } from "zod"
import {listRecipesProcedure} from "~/server/api/modules/recipes/procedures/listRecipes";
import {getRecipeByIdProcedure} from "~/server/api/modules/recipes/procedures/getById";
import {checkGrocyConnectionProcedure} from "~/server/api/modules/grocy/procedures/checkGrocyConnection";

export const grocyRouter = createTRPCRouter({
  checkConnection: checkGrocyConnectionProcedure
})
