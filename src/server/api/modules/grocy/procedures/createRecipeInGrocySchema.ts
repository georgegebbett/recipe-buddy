import z from "zod"

const IgnoredIngredientSchema = z.object({
  scrapedName: z.string(),
  ignored: z.literal(true),
})

const UnignoredIngredientSchema = z.object({
  productId: z.string(),
  amount: z.coerce.number(),
  unitId: z.string(),
  scrapedName: z.string(),
  ignored: z.literal(false),
  note: z.string().trim().optional(),
  group: z.string().trim().optional(),
})

export type UnignoredIngredient = z.infer<typeof UnignoredIngredientSchema>

const IngredientSchema = z.union([
  UnignoredIngredientSchema,
  IgnoredIngredientSchema,
])

const numberLike = z.union([z.number(), z.string()])
const numberLikeToNumberAtLeastOne = numberLike
  .pipe(
    z.coerce
      .number()
      .int("Must be a whole number")
      .min(0, "Must be a positive number")
  )
  .transform((a) => {
    if (a < 1) return 1
    return a
  })

export const CreateRecipeInGrocyCommandSchema = z.object({
  recipeBuddyRecipeId: z.number(),
  recipeName: z.string().trim().min(1),
  ingredients: IngredientSchema.array(),
  method: z.string().optional(),
  imageUrl: z.string().url().optional(),
  servings: numberLikeToNumberAtLeastOne.optional(),
})

export type CreateRecipeInGrocyCommand = z.infer<
  typeof CreateRecipeInGrocyCommandSchema
>
