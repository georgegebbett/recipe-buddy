import z from "zod"

/**
 * A single HowToStep as per schema.org/HowToStep.
 * We use passthrough() so that extra fields like @type, name, url don't cause
 * validation failures.
 */
const HowToStepSchema = z
  .object({
    text: z.string(),
  })
  .passthrough()

/**
 * A HowToSection groups steps under a heading (schema.org/HowToSection).
 * Chefkoch and some other sites use this structure.
 * We flatten all nested steps into a single list.
 */
const HowToSectionSchema = z
  .object({
    itemListElement: z.array(HowToStepSchema),
  })
  .passthrough()

/**
 * recipeInstructions can arrive in three formats across different recipe sites:
 *
 * 1. Plain string  — e.g. Chefkoch.de
 *    "Zwiebeln würfeln. Dann alles zusammen braten..."
 *
 * 2. Array of HowToStep — most standard sites (NYT Cooking, BBC Food, …)
 *    [{ "@type": "HowToStep", "text": "Zwiebeln würfeln." }, …]
 *
 * 3. Array of HowToSection — sites that group steps by section
 *    [{ "@type": "HowToSection", "itemListElement": [{ "text": "..." }] }, …]
 *
 * This schema normalises all three variants into a single HTML string.
 */
export const StepsToStringSchema = z
  .union([
    z.string(),
    z.array(HowToStepSchema),
    z.array(HowToSectionSchema),
  ])
  .transform((steps) => {
    if (typeof steps === "string") {
      return beautifyInstructions(steps)
    }

    // Flatten HowToSection arrays into a plain list of step texts
    const texts = steps.flatMap((step) => {
      if ("itemListElement" in step) {
        // HowToSection: pull out nested steps
        return (step as z.infer<typeof HowToSectionSchema>).itemListElement.map(
          (s) => s.text
        )
      }
      // HowToStep
      return [(step as z.infer<typeof HowToStepSchema>).text]
    })

    return beautifyInstructions(texts.join("\n\n"))
  })

const beautifyInstructions = (input: string): string => {
  const sections = input.split(/\n\n+/)

  const formattedSections = sections.map((section, index) => {
    const numberedSection = section.replace(/\n/g, "<br>")
    return `${index + 1}. ${numberedSection}`
  })

  return formattedSections.map((section) => `<p>${section}</p>`).join("")
}

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
