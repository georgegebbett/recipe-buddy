import { protectedProcedure } from "~/server/api/trpc"
import { listApiKeys } from "../service/listApiKeys"

export const listApiKeysProcedure = protectedProcedure.query(async ({ ctx }) => {
  return listApiKeys({
    db: ctx.db,
    userId: parseInt(ctx.session.user.id),
  })
})
