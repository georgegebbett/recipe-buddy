import { TRPCError } from "@trpc/server"
import {
  ExtractNumberSchema,
  JsonLdRecipeSchema,
  RecipeImageUrlSchema,
  StepsSchema,
} from "~/server/api/modules/recipes/service/schemas"
import { InsertIngredient, InsertRecipe } from "~/server/db/schema"
import { JSDOM } from "jsdom"

import { logger } from "~/lib/logger"

async function getNodeListOfMetadataNodesFromUrl(url: string) {
  const dom = await JSDOM.fromURL(url)
  const nodeList: NodeList = dom.window.document.querySelectorAll(
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
  return input.replace(/[\u00A0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/g, ' ');
}

function escapeRealLineBreaksInString(input: string): string {
  return input.replace(/(["'])([\s\S]*?)\1/g, (match, quote, content) => {
    const escapedContent = content.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
    return quote + escapedContent + quote;
  });
}


function getSchemaRecipeFromNodeList(nodeList: NodeList) {
  for (const node of nodeList.values()) {
    let { textContent } = node

    if (!textContent) {
      logger.debug("No text content in node, trying next node")
      continue
    }

    // Preprocess the text to ensure that it can be parsed as JSON
    textContent = escapeRealLineBreaksInString(textContent);
    textContent = normalizeWhitespace(textContent);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parsedNodeContent: any

    try {
      parsedNodeContent = JSON.parse(textContent)
    } catch (e) {
      logger.error(
        { error: e, textContent },
        "Error in extracting JSON from node content"
      )
      continue
    }

    if (Array.isArray(parsedNodeContent)) {
      console.log("its an array")
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
  throw new Error("Unable to extract Recipe metadata from provided url")
}

export async function hydrateRecipe(url: string) {
  const nodeList: NodeList = await getNodeListOfMetadataNodesFromUrl(url)

  const recipeData = getSchemaRecipeFromNodeList(nodeList)

  let steps: string = ""
  try {
      steps = StepsSchema(recipeData.recipeInstructions)
    }
  catch(e){
      throw new Error("Could not parse steps")
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
    steps: steps,
    imageUrl: image.success ? image.data : undefined,
    servings: servings.success ? servings.data : undefined,
  }

  return { recipe, ingredients: ings }
}
