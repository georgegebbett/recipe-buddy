import { z } from "zod"
import { protectedProcedure } from "~/server/api/trpc"
import { generateApiKey } from "../service/generateApiKey"

export const generateApiKeyProcedure = protectedProcedure
  .input(
    z.object({
      name: z.string().min(1).max(255),
    })
  )
  .mutation(async ({ ctx, input }) => {
    return generateApiKey({
      db: ctx.db,
      userId: parseInt(ctx.session.user.id),
      name: input.name,
    })
  })
