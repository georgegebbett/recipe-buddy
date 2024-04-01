import { TRPCError } from "@trpc/server"
import { CreateUserSchema } from "~/server/api/modules/users/procedures/createUserSchema"
import { checkIsSetup } from "~/server/api/modules/users/service/checkIsSetup"
import { createUser } from "~/server/api/modules/users/service/createUser"
import { publicProcedure } from "~/server/api/trpc"

export const setupUserProcedure = publicProcedure
  .input(CreateUserSchema)
  .mutation(async ({ input }) => {
    const isSetup = await checkIsSetup()

    if (isSetup)
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Already set up",
      })

    // Otherwise, create a user
    return await createUser(input)
  })
