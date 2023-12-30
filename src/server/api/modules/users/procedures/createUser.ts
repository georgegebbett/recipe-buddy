import { CreateUserSchema } from '~/server/api/modules/users/procedures/createUserSchema';
import { protectedProcedure } from '~/server/api/trpc';
import z from 'zod';
import { createUser } from '~/server/api/modules/users/service/createUser';

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
