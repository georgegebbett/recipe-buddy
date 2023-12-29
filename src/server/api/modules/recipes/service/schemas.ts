import z from "zod"

export const RecipeStepSchema = z.union([
  z.string(),
  z.object({text: z.string()})
]).transform((input): string => {
  if (typeof input === "string") return input
  return input.text
})

const baseUrlSchema = z.union([
  z.string(),
  z.object({url: z.string()})
])
export const RecipeImageUrlSchema = z.union([
  baseUrlSchema,
  baseUrlSchema.array()
]).transform((input): string | undefined => {
  const res = Array.isArray(input) ? input[0] : input

  if (!res || typeof res === "string") return res
  return res.url
})

export const JsonLdRecipeSchema = z.object({
  "@type": z.string()
})
