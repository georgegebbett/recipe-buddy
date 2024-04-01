import { grocyFetch } from "~/server/api/modules/grocy/service/client"
import z from "zod"

const grocyProductSchema = z.object({
  id: z.coerce.string(),
  name: z.string(),
  qu_id_stock: z.coerce.string(),
})

type GrocyProduct = z.infer<typeof grocyProductSchema>

export const getGrocyProducts = async (): Promise<GrocyProduct[]> => {
  const prods = await grocyFetch("/objects/products", { cache: "no-cache" })

  const json = await prods.json()

  return grocyProductSchema.array().parse(json)
}
