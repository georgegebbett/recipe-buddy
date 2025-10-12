import { TRPCError } from "@trpc/server"
import {
  ExtractNumberSchema,
  JsonLdRecipeSchema,
  RecipeImageUrlSchema,
  StepsToStringSchema,
} from "~/server/api/modules/recipes/service/schemas"
import { InsertIngredient, InsertRecipe } from "~/server/db/schema"
import * as cheerio from "cheerio"
import * as domhandler from "domhandler"

import { logger } from "~/lib/logger"

async function getSchemaRecipeFromUrl(url: string) {
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
    return getSchemaRecipeFromMicrodata(dom)
  }

  return getSchemaRecipeFromNodeList(nodeList)
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


function microDataExtractText(element: domhandler.Element): string {
    const maybeContent = element.attribs["content"]
    if (maybeContent !== undefined) {
      return maybeContent
    }
    const node = cheerio.load(element)
    return node.text()
}

interface SchemaRecipe {
  name?: string,
  image?: string,
  recipeYield?: string,
  recipeIngredient: string[],
  recipeInstructions: string | string[],
}

function getSchemaRecipeFromMicrodata(dom: cheerio.CheerioAPI): SchemaRecipe {
  const nodeList = dom(
    "[itemscope]"
  )

  if (nodeList.length === 0) {
    throw new TRPCError({
      message: "The linked page contains no metadata",
      code: "INTERNAL_SERVER_ERROR",
    })
  }

  const res: SchemaRecipe = {
    name: undefined,
    image: undefined,
    recipeYield: undefined,
    recipeIngredient: [],
    recipeInstructions: [],
  }
  for (const element of nodeList) {
    const ty = element.attribs["itemtype"]
    if (ty === undefined || !ty.toLowerCase().includes("recipe")) {
      continue;
    }
    const node = cheerio.load(element)

    const properties = node("[itemprop]")
    for (const property of properties) {
      const ty = property.attribs["itemprop"]
      if (ty == "name") {
        res.name = microDataExtractText(property)
      } else if (ty == "image") {
        res.image = microDataExtractText(property)
      } else if (ty == "recipeYield") {
        res.recipeYield = microDataExtractText(property)
      } else if (ty == "recipeIngredient") {
        res.recipeIngredient.push(microDataExtractText(property))
      } else if (ty == "recipeInstructions") {
        const instructions = cheerio.load(property)
        const listItems = instructions("li")
        if (listItems.length > 0) {
            res.recipeInstructions = []
            for (const listItem of listItems) {
                res.recipeInstructions.push(microDataExtractText(listItem))
            }
        } else {
            res.recipeInstructions = microDataExtractText(property)
        }
      } else {
        console.log(`ignoring unknown itemtype '${ty}'`)
      }
    }
  }

  if (Object.keys(res).length === 0) {
    throw new Error("Unable to extract Recipe metadata from provided url")
  }
  return res
}


export async function hydrateRecipe(url: string) {
  const recipeData = await getSchemaRecipeFromUrl(url)

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
