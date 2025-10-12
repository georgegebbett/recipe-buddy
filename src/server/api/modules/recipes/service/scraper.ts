import { TRPCError } from "@trpc/server"
import {
  ExtractNumberSchema,
  JsonLdRecipeSchema,
  RecipeImageUrlSchema,
  StepsToStringSchema,
} from "~/server/api/modules/recipes/service/schemas"
import { InsertIngredient, InsertRecipe } from "~/server/db/schema"
import * as cheerio from "cheerio"

import { logger } from "~/lib/logger"

async function getNodeListOfMetadataNodesFromUrl(url: string) {
  let dom: cheerio.CheerioAPI 
  try {
    dom = await cheerio.fromURL(url)
  } catch (e) {
    let message  = `Can't load from url ${url}`
    if (typeof e === "object" && e !== null && "statusCode" in e) {
        message = `${message}: statuscode ${e.statusCode}`
    }
    throw new TRPCError({
      message: `${message}: ${e}`,
      code: "INTERNAL_SERVER_ERROR",
    })
  }
  const nodeList = dom(
    "script[type='application/ld+json']"
  )

  if (nodeList.length === 0) {
    throw new TRPCError({
      message: "The linked page contains no metadata",
      code: "INTERNAL_SERVER_ERROR",
    })
  }

  return nodeList
}

function jsonObjectIsRecipe(jsonObject: Record<string, unknown>): boolean {
  const parsed = JsonLdRecipeSchema.safeParse(jsonObject)

  if (parsed.success) {
    if (parsed.data["@type"].toLowerCase().includes("recipe")) return true
  }

  return false
}

function jsonObjectHasGraph(jsonObject: Record<string, unknown>): boolean {
  return Object.prototype.hasOwnProperty.call(jsonObject, "@graph")
}

function normalizeWhitespace(input: string): string {
  return input.replace(
    /[\u00A0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/g,
    " "
  )
}

function escapeRealLineBreaksInString(input: string): string {
  return input.replace(/(["'])([\s\S]*?)\1/g, (match, quote, content) => {
    const escapedContent = content.replace(/\n/g, "\\n").replace(/\r/g, "\\r")
    return quote + escapedContent + quote
  })
}

function getSchemaRecipeFromNodeList(nodeList: cheerio.Cheerio<domhandler.Element>) {
  for (const nodeParent of nodeList) {
    for (const node of nodeParent.children) {
      if (!(node instanceof domhandler.Text)) {
        continue
      }
      const textContent = node.data
  
      if (!textContent) {
        logger.debug("No text content in node, trying next node")
        continue
      }
  
      // Preprocess the text to ensure that it can be parsed as JSON
      const textContentWithEscapedLinebreaks =
        escapeRealLineBreaksInString(textContent)
      const formattedTextContent = normalizeWhitespace(
        textContentWithEscapedLinebreaks
      )
  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let parsedNodeContent: any
  
      try {
        parsedNodeContent = JSON.parse(formattedTextContent)
      } catch (e) {
        logger.error(
          { error: e, textContent },
          "Error in extracting JSON from node content"
        )
        continue
      }
  
      if (Array.isArray(parsedNodeContent)) {
        for (const metadataObject of parsedNodeContent) {
          if (jsonObjectIsRecipe(metadataObject)) {
            return metadataObject
          }
        }
      } else {
        if (jsonObjectIsRecipe(parsedNodeContent)) {
          return parsedNodeContent
        }
        if (jsonObjectHasGraph(parsedNodeContent)) {
          for (const graphNode of parsedNodeContent["@graph"]) {
            if (jsonObjectIsRecipe(graphNode)) {
              return graphNode
            }
          }
        }
      }
    }
  }
  throw new Error("Unable to extract Recipe metadata from provided url")
}

export async function hydrateRecipe(url: string) {
  const nodeList = await getNodeListOfMetadataNodesFromUrl(url)

  const recipeData = getSchemaRecipeFromNodeList(nodeList)

  const { error, data: steps } = StepsToStringSchema.safeParse(
    recipeData.recipeInstructions
  )

  if (error) {
    throw new Error("Unable to parse steps: ".concat(error.toString()))
  }

  const ingredients: string[] = recipeData.recipeIngredient
    .flat()
    .map((ingredient: string) => ingredient.trim())

  const image = RecipeImageUrlSchema.safeParse(recipeData.image)

  const ings: Pick<InsertIngredient, "scrapedName">[] = ingredients.map(
    (a) => ({ scrapedName: a })
  )

  const servings = ExtractNumberSchema.safeParse(recipeData.recipeYield)

  const recipe: InsertRecipe = {
    name: recipeData.name,
    url,
    steps,
    imageUrl: image.success ? image.data : undefined,
    servings: servings.success ? servings.data : undefined,
  }

  return { recipe, ingredients: ings }
}
