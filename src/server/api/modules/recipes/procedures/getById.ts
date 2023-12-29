import {protectedProcedure} from "~/server/api/trpc";
import z from "zod"
import {db} from "~/server/db";
import {recipes as recipeTable} from "~/server/db/schema";
import {eq} from "drizzle-orm";

export const getRecipeByIdProcedure = protectedProcedure
    .input(z.object({
      id: z.coerce.number().int()
    })).query(async ({input}) => db
        .query
        .recipes
        .findFirst({where: eq(recipeTable.id, input.id), with: {ingredients: true}})
    )
