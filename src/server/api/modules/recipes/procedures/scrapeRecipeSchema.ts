import z from "zod";

export const ScrapeRecipeSchema = z.object({
  url: z.string().url(),
})

export type ScrapeRecipe = z.infer<typeof ScrapeRecipeSchema>
