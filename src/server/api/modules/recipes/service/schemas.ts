import z from "zod"

const HowToStepSchema = z.object({
    "@type": z.literal("HowToStep"),
    name: z.any(),
    text: z.string(),
})

const HowToSectionSchema = z.object({
    "@type": z.literal("HowToSection"),
    name: z.any(),
    itemListElement: z.array(HowToStepSchema),
})

const StepSchema = z.union([
    z.discriminatedUnion("@type", [
        HowToSectionSchema,
        HowToStepSchema,
    ]),
    z.object({
        text: z.string(),
    }),
    z.object({
        name: z.string(),
    }),
    z.string(),
])

const beautifyInstructions = (input: string): string => {
  const sections = input.split(/\n\n+/)

  const formattedSections = sections.map((section, index) => {
    const numberedSection = section.replace(/\n/g, "<br>")
    return `${index + 1}. ${numberedSection}`
  })

  return formattedSections.map((section) => `<p>${section}</p>`).join("")
}

type StepsSchemaType = string | {
    "@type": "HowToStep";
    text: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name?: any;
} | {
    "@type": "HowToSection";
    itemListElement: {
        "@type": "HowToStep";
        text: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name?: any;
    }[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name?: any;
} | {
    text: string;
} | {
    name: string;
}
const transformStepsSchema = (
    steps:  StepsSchemaType | StepsSchemaType[],
    ctx: z.RefinementCtx
): string => {
    if (Array.isArray(steps)) {
        return transformStepsSchema(steps.map(step => transformStepsSchema(step, ctx)).join("\n\n"), ctx)
    }
    if (typeof steps === "string") {
        return steps
    }
    if ("@type" in steps) {
        if (steps["@type"] == "HowToSection") {
            return transformStepsSchema(steps.itemListElement, ctx)
        } 
        if (steps["@type"] == "HowToStep") {
            return transformStepsSchema(steps.text, ctx)
        }
    }
    if ("text" in steps) {
        return steps.text
    }
    if ("name" in steps) {
        return steps.name
    }

    ctx.addIssue({
        code: "custom",
        message: "invalid step item",
    })
    return z.NEVER
}

export const StepsToStringSchema = z.union([StepSchema, z.array(StepSchema)])
  .transform((steps, ctx) => {
    const res = transformStepsSchema(steps, ctx)
    if (res === z.NEVER) {
        return res
    }
    return beautifyInstructions(res)
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
