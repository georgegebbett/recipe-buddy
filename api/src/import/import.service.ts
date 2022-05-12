import { Injectable } from '@nestjs/common';
import { RecipesService } from '../recipes/recipes.service';
import { Recipe } from 'schema-dts';

@Injectable()
export class ImportService {
  constructor(private recipesService: RecipesService) {}

  addRecipesToDatabaseFromFile(importFile: Express.Multer.File) {
    const parseSteps: (stepsArr: object[]) => string[] = (
      stepsArr: object[],
    ) => {
      // @ts-ignore
      return stepsArr.map((step) => step.text);
    };

    try {
      const textContent = importFile.buffer.toString();
      const jsonObject: Recipe[] = JSON.parse(textContent);

      for (const recipe of jsonObject) {
        this.recipesService.createHydratedRecipe({
          url: 'no url for imported recipe',
          name: recipe.name.toString(),
          ingredients: recipe.recipeIngredient.valueOf() as string[],
          steps: parseSteps(recipe.recipeInstructions.valueOf() as object[]),
        });
      }
      return Promise.resolve({
        statusCode: 201,
        message: 'Recipes imported successfully',
      });
    } catch (e) {
      return Promise.reject({
        statusCode: 500,
        message: e.message,
      });
    }
  }
}
