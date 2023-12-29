import {JSDOM} from "jsdom";
import {TRPCError} from "@trpc/server";
import {JsonLdRecipeSchema, RecipeImageUrlSchema, RecipeStepSchema} from "~/server/api/modules/recipes/service/schemas";
import {logger} from "~/lib/logger";
import {InsertIngredient, InsertRecipe} from "~/server/db/schema";

async function getNodeListOfMetadataNodesFromUrl(url: string) {
  const dom = await JSDOM.fromURL(url);
  const nodeList: NodeList = dom.window.document.querySelectorAll(
      "script[type='application/ld+json']",
  );

  if (nodeList.length === 0) {
    throw new TRPCError({
      message: 'The linked page contains no metadata',
      code: "INTERNAL_SERVER_ERROR"
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
  return Object.prototype.hasOwnProperty.call(jsonObject, '@graph');
}

function getSchemaRecipeFromNodeList(nodeList: NodeList) {
  for (const node of nodeList.values()) {
    const {textContent} = node

    if (!textContent) {
      logger.debug("No text content in node, trying next node")
      continue
    }

    let parsedNodeContent: any

    try {
      parsedNodeContent = JSON.parse(textContent)
    } catch (e) {
      logger.error({error: e, textContent}, "Error in extracting JSON from node content")
      continue;
    }

    if (Array.isArray(parsedNodeContent)) {
      for (const metadataObject of parsedNodeContent) {
        if (jsonObjectIsRecipe(metadataObject)) {
          return metadataObject;
        }
      }
    } else {
      if (jsonObjectIsRecipe(parsedNodeContent)) {
        return parsedNodeContent;
      }
      if (jsonObjectHasGraph(parsedNodeContent)) {
        for (const graphNode of parsedNodeContent['@graph']) {
          if (jsonObjectIsRecipe(graphNode)) {
            return graphNode;
          }
        }
      }
    }
  }
  throw new Error('Unable to extract Recipe metadata from provided url');
}

export async function hydrateRecipe(url: string) {
  const nodeList: NodeList = await getNodeListOfMetadataNodesFromUrl(url)

  const recipeData = getSchemaRecipeFromNodeList(nodeList);

  const steps = RecipeStepSchema.array().safeParse(recipeData.recipeInstructions)

  const ingredients: string[] = recipeData.recipeIngredient.flat().map((ingredient: string) => ingredient.trim());

  const image = RecipeImageUrlSchema.safeParse(recipeData.image)

  if (!steps.success) {
    throw new Error("Could not parse steps")
  }


  const ings: Pick<InsertIngredient, 'scrapedName'>[] = ingredients.map(a => ({scrapedName: a}))

  const recipe: InsertRecipe = {
    name: recipeData.name,
    url,
    steps: steps.data.join("\n"),
    imageUrl: image.success ? image.data : undefined
  }

  return {recipe, ingredients: ings};
}
