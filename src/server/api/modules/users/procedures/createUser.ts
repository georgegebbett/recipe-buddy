import { CreateUserSchema } from "~/server/api/modules/users/procedures/createUserSchema"
import { createUser } from "~/server/api/modules/users/service/createUser"
import { protectedProcedure } from "~/server/api/trpc"
import z from "zod"

export const createUserProcedure = protectedProcedure
  .input(CreateUserSchema)
  .output(
    z.object({
      id: z.number(),
      name: z.string(),
      username: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    return createUser(input)
  })
