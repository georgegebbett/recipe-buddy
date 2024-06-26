import {
  CreateRecipeInGrocyCommandSchema,
  UnignoredIngredient,
} from "~/server/api/modules/grocy/procedures/createRecipeInGrocySchema"
import { grocyFetch } from "~/server/api/modules/grocy/service/client"
import { getGrocyProducts } from "~/server/api/modules/grocy/service/getGrocyProducts"
import { deleteRecipe } from "~/server/api/modules/recipes/service/deleteRecipe"
import { protectedProcedure } from "~/server/api/trpc"
import normalizeUrl from "normalize-url"
import slugify from "slugify"
import { v4 } from "uuid"
import z from "zod"

import { logger } from "~/lib/logger"

export const createRecipeInGrocyProcedure = protectedProcedure
  .input(CreateRecipeInGrocyCommandSchema)
  .mutation(async ({ input }) => {
    let imageFilename: string | undefined = undefined

    const grocyProducts = await getGrocyProducts()

    if (input.imageUrl) {
      const normalised = normalizeUrl(input.imageUrl, {
        removeQueryParameters: true,
      })

      const split = normalised.split(".")
      const extension = split[split.length - 1]

      const image = await fetch(input.imageUrl)
      const blob = await image.blob()

      const slug = slugify(input.recipeName)

      const uuid = v4()
      const [beginningOfUuid] = uuid.split("-")

      imageFilename = slug + "-" + beginningOfUuid + "." + extension

      logger.info(
        { imageFilename, base64: btoa(imageFilename) },
        "Uploading image to Grocy"
      )

      await grocyFetch(`/files/recipepictures/${btoa(imageFilename)}`, {
        method: "PUT",
        body: blob,
        headers: { "Content-Type": "application/octet-stream" },
      })

      logger.info("Uploaded image to Grocy")
    }

    logger.info(input, "Creating recipe in Grocy")

    const recipeBody = {
      name: input.recipeName,
      description: input.method,
      picture_file_name: imageFilename,
      base_servings: input.servings,
    }

    const recipeResponse = await grocyFetch("/objects/recipes", {
      method: "POST",
      body: JSON.stringify(recipeBody),
      headers: { "Content-Type": "application/json" },
    })

    const recipeJson = await recipeResponse.json()

    logger.info(recipeJson, "Recipe created")

    const recipeId = z.coerce.string().parse(recipeJson.created_object_id)

    const filteredIngredients = input.ingredients.filter(
      (a): a is UnignoredIngredient => !a.ignored
    )

    for (const ingredient of filteredIngredients) {
      logger.info(ingredient, `Creating ingredient [${ingredient.scrapedName}]`)

      const grocyProduct = grocyProducts.find(
        (a) => a.id === ingredient.productId
      )

      if (!grocyProduct) continue

      const useAnyUnit: "1" | "0" =
        ingredient.unitId === grocyProduct.qu_id_stock ? "0" : "1"

      const body = {
        recipe_id: recipeId,
        product_id: ingredient.productId,
        amount: ingredient.amount,
        qu_id: ingredient.unitId,
        only_check_single_unit_in_stock: useAnyUnit,
        note: ingredient.note,
        ingredient_group: ingredient.group,
      }

      const ingredientResponse = await grocyFetch("/objects/recipes_pos", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      })

      const ingredientJson = await ingredientResponse.json()

      if (!ingredientResponse.ok) {
        throw new Error(ingredientJson.error_message ?? "An error occurred")
      }

      logger.info(ingredientJson, "Ingredient created")
    }

    logger.info("Recipe creation success, deleting recipe from Recipe Buddy")

    await deleteRecipe(input.recipeBuddyRecipeId)
  })
