import z from "zod"

const IgnoredIngredientSchema = z.object({
  scrapedName: z.string(),
  ignored: z.literal(true),
})

const UnignoredIngredientSchema = z.object({
  productId: z.string(),
  amount: z.number(),
  unitId: z.string(),
  scrapedName: z.string(),
  ignored: z.literal(false),
})

export type UnignoredIngredient = z.infer<typeof UnignoredIngredientSchema>

const IngredientSchema = z.union([
  UnignoredIngredientSchema,
  IgnoredIngredientSchema,
])
export const CreateRecipeInGrocySchema = z.object({
  recipeBuddyRecipeId: z.number(),
  recipeName: z.string().trim().min(1),
  ingredients: IngredientSchema.array(),
  method: z.string().optional(),
  imageUrl: z.string().url().optional(),
})

export type CreateRecipeInGrocy = z.infer<typeof CreateRecipeInGrocySchema>