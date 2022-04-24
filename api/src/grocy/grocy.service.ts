import { HttpException, Injectable } from '@nestjs/common';
import { AddRecipeToGrocyDto } from './dto/add-recipe-to-grocy.dto';
import axios from 'axios';
import { uid } from 'rand-token';
import * as FormData from 'form-data'

const grocyBase = "https://test-r6aira2jrtr52y34eks6.demo.grocy.info";
const grocyKey = "bMSJRlURCPkG5tMW8xpnZYXS6dAYXmMM4ROomYrm7VX6rv8R7m";
const newRecipeSlug = "/api/objects/recipes";
const newIngredientSlug = "/api/objects/recipes_pos";
const newImageSlug = (uid) => `/api/files/recipepictures/${uid}`;

@Injectable()
export class GrocyService {

  parseSteps = (steps: string[]) => (
    `<ol>${steps.map(step => `<li>${step}</li>`).join(' ')}</ol>`
  )

  async createRecipeInGrocy(name: string, steps: string[]) {
    console.log(name);
    const parsedSteps = this.parseSteps(steps);

    try {
      const {data} = await axios.post(
        `${grocyBase}${newRecipeSlug}`,
        {
          name: name,
          description: parsedSteps
        },
        {
          headers: {
            "GROCY-API-KEY": grocyKey
          }
        }
      )
      console.log(data);
      return data;
    } catch (e) {
      throw e;
    }

  }

  async associateIngredientsWithRecipe(recipeId: string, ingredients: any[]) {
    try {
      for (const ingredient of ingredients) {
        axios.post(
          `${grocyBase}${newIngredientSlug}`,
          {
            "recipe_id": recipeId,
            "product_id": ingredient.grocyProductId,
            "amount": ingredient.quantity,
            "qu_id": ingredient.quantityUnitId,
            "only_check_single_unit_in_stock": ingredient.useAnyUnit ? "1" : "0"
          },
          {
            headers: {
              "GROCY-API-KEY": grocyKey
            }
          }
        )
      }
    } catch (e) {
      throw e;
    }

  }

  async uploadPictureToGrocyAndAssociateWithRecipe(pictureUrl: string, recipeId: string) {

    try {
      const { data } = await axios.get(
        pictureUrl,
        {
          responseType: 'stream'
        }
      );

      const extension = pictureUrl.match(/\.([0-z]+)$/g)[0];
      const filename = uid(25) + extension;
      const base64Filename = Buffer.from(filename).toString('base64');

      await axios.put(
        `${grocyBase}${newImageSlug(base64Filename)}`,
        data,
        {
          headers: {
            "GROCY-API-KEY": grocyKey,
          }
        }
      );

      await axios.put(
        `${grocyBase}${newRecipeSlug}/${recipeId}`,
        {
          "picture_file_name": filename
        },
        {
          headers: {
            "GROCY-API-KEY": grocyKey
          }
        }
      )

    } catch (e) {
      throw e;
    }
  }

  async addRecipeToGrocy(addRecipeToGrocyDto: AddRecipeToGrocyDto): Promise<any> {
    try {
      const data = await this.createRecipeInGrocy(addRecipeToGrocyDto.name, addRecipeToGrocyDto.steps);
      const { created_object_id } = data;
      await this.associateIngredientsWithRecipe(created_object_id, addRecipeToGrocyDto.ingredients);
      await this.uploadPictureToGrocyAndAssociateWithRecipe(addRecipeToGrocyDto.imageUrl, created_object_id);
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
    return Promise.resolve({message: "Recipe created successfully"});
  }
}
