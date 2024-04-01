import { checkIsSetup } from "~/server/api/modules/users/service/checkIsSetup"
import { publicProcedure } from "~/server/api/trpc"

export const checkIsSetupProcedure = publicProcedure.query(checkIsSetup)
