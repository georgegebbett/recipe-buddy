import z from "zod"

const StepSchema = z.object({
  "@context": z.string(),
  "@type": z.string(),
  text: z.string(),
})

const beautifyInstructions = (input: string): string => {
  const sections = input.split(/\n\n+/)

  const formattedSections = sections.map((section, index) => {
    const numberedSection = section.replace(/\n/g, "<br>")
    return `${index + 1}. ${numberedSection}`
  })

  return formattedSections.map((section) => `<p>${section}</p>`).join("")
}

export const StepsToStringSchema = z
  .union([z.array(StepSchema), z.string()])
  .transform((steps) => {
    if (typeof steps === "string") return beautifyInstructions(steps)
    return beautifyInstructions(steps.map((step) => step.text).join("\n\n"))
  })

const baseUrlSchema = z.union([z.string(), z.object({ url: z.string() })])
export const RecipeImageUrlSchema = z
  .union([baseUrlSchema, baseUrlSchema.array()])
  .transform((input): string | undefined => {
    const res = Array.isArray(input) ? input[0] : input

    if (!res || typeof res === "string") return res
    return res.url
  })

export const JsonLdRecipeSchema = z.object({
  "@type": z.union([z.string(), z.tuple([z.string()]).transform((a) => a[0])]),
})

export const ExtractNumberSchema = z.coerce.string().transform((val, ctx) => {
  const numberRegex = /\d+/g

  const regexResult = numberRegex.exec(val)

  if (!regexResult) {
    ctx.addIssue({
      message: "No numbers found in servings",
      code: "custom",
    })
    return z.NEVER
  }

  const [first] = regexResult

  return parseInt(first)
})
