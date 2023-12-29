import {recipeRouter} from "~/server/api/routers/recipe"
import {createTRPCRouter} from "~/server/api/trpc"
import {grocyRouter} from "~/server/api/routers/grocy";
import {userRouter} from "~/server/api/routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  recipe: recipeRouter,
  grocy: grocyRouter,
  users: userRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
