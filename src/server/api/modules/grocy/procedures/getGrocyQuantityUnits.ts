import { grocyFetch } from "~/server/api/modules/grocy/service/client"
import { protectedProcedure } from "~/server/api/trpc"
import z from "zod"

const grocyQuantityUnitSchema = z.object({
  id: z.coerce.string(),
  name: z.string(),
})

export const getGrocyQuantityUnitsProcedure = protectedProcedure.query(
  async () => {
    const prods = await grocyFetch("/objects/quantity_units")

    const json = await prods.json()

    return grocyQuantityUnitSchema.array().parse(json)
  }
)
