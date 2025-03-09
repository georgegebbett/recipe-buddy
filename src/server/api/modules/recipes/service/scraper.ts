import { TRPCError } from "@trpc/server"
import {
  ExtractNumberSchema,
  JsonLdRecipeSchema,
  RecipeImageUrlSchema,
  RecipeStepSchema,
} from "~/server/api/modules/recipes/service/schemas"
import { InsertIngredient, InsertRecipe } from "~/server/db/schema"
import { JSDOM } from "jsdom"

import { logger } from "~/lib/logger"

function normalizeWhitespace(input: string): string {
  return input.replace(/[\u00A0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/g, ' ');
}

function escapeRealLineBreaksInString(input: string): string {
  return input.replace(/(["'])([\s\S]*?)\1/g, (match, quote, content) => {
    const escapedContent = content.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
    return quote + escapedContent + quote;
  });
}

async function getNodeListOfMetadataNodesFromUrl(url: string) {
  const dom = await JSDOM.fromURL(url)
  const nodeList: NodeList = dom.window.document.querySelectorAll(
    "script[type='application/ld+json']"
  )

  if (nodeList.length === 0) {
    logger.error("No metadata found");
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
    if (parsed.data["@type"].some(i => i.toLowerCase().includes("recipe"))) return true
  } else {
    logger.error("Unable to safe parse Recipe Schema");
  }

  return false
}

function jsonObjectHasGraph(jsonObject: Record<string, unknown>): boolean {
  return Object.prototype.hasOwnProperty.call(jsonObject, "@graph")
}

function jsonObjectIsStep(jsonObject: Record<string, unknown>): boolean {
  const parsed = JsonLdRecipeSchema.safeParse(jsonObject)

  if (parsed.success) {
    logger.debug(JSON.stringify(parsed.data["@type"]));
    if (parsed.data["@type"].some(i => i.toLowerCase().includes("howtostep"))) return true
  } else {
    logger.error("Unable to safe parse Recipe Schema");
  }
  return false
}

function getSchemaRecipeFromNodeList(nodeList: NodeList) {
  for (const node of nodeList.values()) {
    let { textContent } = node

    if (!textContent) {
      logger.debug("No text content in node, trying next node")
      continue
    }

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
    logger.error(`Unable to extract recipe metadata: ${JSON.stringify(parsedNodeContent)}`);
  }
  throw new Error("Unable to extract Recipe metadata from provided url")
}

export async function hydrateRecipe(url: string) {
  const nodeList: NodeList = await getNodeListOfMetadataNodesFromUrl(url)

  const recipeData = getSchemaRecipeFromNodeList(nodeList)

  const steps = [];
  if (typeof recipeData.recipeInstructions === "string") {
    steps.push(...(recipeData.recipeInstructions.split(/\n\n+/)));
  } else {
    for(const step of recipeData.recipeInstructions) {
      if (jsonObjectIsStep(step)) {
        const temp = RecipeStepSchema.safeParse(step)
        if (temp.success) {
          steps.push(temp.data);
        }
      }
    }
  }

  if (steps.length === 0) {
    logger.error("Unable to parse steps")
    throw new Error("Could not parse steps");
  }

  const ingredients: string[] = recipeData.recipeIngredient
    .flat()
    .map((ingredient: string) => ingredient.trim())

  const image = RecipeImageUrlSchema.safeParse(recipeData.image)

  const ings: Pick<InsertIngredient, "scrapedName">[] = ingredients.map(
    (a) => ({ scrapedName: a })
  )

  const servings = ExtractNumberSchema.safeParse(recipeData.recipeYield)
  let stepsString = "<ol>";
  steps.forEach((step) => {
    stepsString += `<li>${step}<\/li>`;
  })
  stepsString += "<\/ol>";

  const recipe: InsertRecipe = {
    name: recipeData.name,
    url,
    steps: stepsString,
    imageUrl: image.success ? image.data : undefined,
    servings: servings.success ? servings.data : undefined,
  }

  return { recipe, ingredients: ings }
}
