import z from "zod"

export const ScrapeRecipeSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
})

export type ScrapeRecipe = z.infer<typeof ScrapeRecipeSchema>
