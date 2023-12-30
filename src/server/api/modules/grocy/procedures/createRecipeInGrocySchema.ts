import z from "zod"

export const IngredientSchema = z.union([
  z.object({
    productId: z.string(),
    amount: z.number(),
    unitId: z.string(),
    scrapedName: z.string(),
    ignored: z.literal(false),
  }),
  z.object({
    scrapedName: z.string(),
    ignored: z.literal(true),
  }),
])
export const CreateRecipeInGrocySchema = z.object({
  recipeName: z.string().trim().min(1),
  ingredients: IngredientSchema.array(),
  method: z.string().optional()
})

export type CreateRecipeInGrocy = z.infer<typeof CreateRecipeInGrocySchema>
