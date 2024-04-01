import { getGrocyProducts } from "~/server/api/modules/grocy/service/getGrocyProducts"
import { protectedProcedure } from "~/server/api/trpc"

export const getGrocyProductsProcedure =
  protectedProcedure.query(getGrocyProducts)
