import { grocyFetch } from "~/server/api/modules/grocy/service/client"
import { protectedProcedure } from "~/server/api/trpc"
import z from "zod"

const grocyProductSchema = z.object({
  id: z.coerce.string(),
  name: z.string(),
  qu_id_stock: z.coerce.string(),
})

export const getGrocyProductsProcedure = protectedProcedure.query(async () => {
  const prods = await grocyFetch("/objects/products")

  const json = await prods.json()

  return grocyProductSchema.array().parse(json)
})
