import { z } from "zod"
import { protectedProcedure } from "~/server/api/trpc"
import { deleteApiKey } from "../service/deleteApiKey"

export const deleteApiKeyProcedure = protectedProcedure
  .input(
    z.object({
      id: z.number(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    return deleteApiKey({
      db: ctx.db,
      userId: parseInt(ctx.session.user.id),
      apiKeyId: input.id,
    })
  })
