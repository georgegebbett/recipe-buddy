import { grocyRouter } from "~/server/api/routers/grocy"
import { recipeRouter } from "~/server/api/routers/recipe"
import { userRouter } from "~/server/api/routers/user"
import { apiKeyRouter } from "~/server/api/routers/apiKey"
import { createTRPCRouter } from "~/server/api/trpc"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  recipe: recipeRouter,
  grocy: grocyRouter,
  users: userRouter,
  apiKeys: apiKeyRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
