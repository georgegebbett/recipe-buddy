import { checkGrocyConnectionProcedure } from "~/server/api/modules/grocy/procedures/checkGrocyConnection"
import { getGrocyProductsProcedure } from "~/server/api/modules/grocy/procedures/getGrocyProducts"
import { getGrocyQuantityUnitsProcedure } from "~/server/api/modules/grocy/procedures/getGrocyQuantityUnits"
import { createTRPCRouter } from "~/server/api/trpc"

export const grocyRouter = createTRPCRouter({
  checkConnection: checkGrocyConnectionProcedure,
  getProducts: getGrocyProductsProcedure,
  getQuantityUnits: getGrocyQuantityUnitsProcedure,
})
