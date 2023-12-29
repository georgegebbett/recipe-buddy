import {protectedProcedure} from "~/server/api/trpc";
import {CreateRecipeInGrocySchema} from "~/server/api/modules/grocy/procedures/createRecipeInGrocySchema";
import {logger} from "~/lib/logger";

export const createRecipeInGrocyProcedure = protectedProcedure
.input(CreateRecipeInGrocySchema)
.mutation(async ({input}) => {

  logger.info(input, "doing some stuff")

})
