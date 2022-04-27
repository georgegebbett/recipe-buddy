import { Recipe } from '../schemas/recipe.schema';
import { InternalServerErrorException } from '@nestjs/common';

const axios = require('axios');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const parseRecipeSteps = (steps) => {
  return steps.map((step) => {
    if (typeof step === 'string') return step.trim();
    if (step.hasOwnProperty('text')) return step.text.trim();
    throw new Error('Unable to parse recipe steps');
  });
};

const parseImageUrl = (image) => {
  if (Array.isArray(image)) image = image[0];
  if (typeof image === 'string') return image;
  if (image.hasOwnProperty('url')) return image.url;
  return undefined;
};

const parseRecipeIngredients = (ingredients) => {
  return ingredients.map((ingredient) => ingredient.trim());
};

const getRecipeDataObjectFromScriptContents = (scriptContents) => {
  let objToReturn;

  if (Array.isArray(scriptContents)) {
    for (const arrItem of scriptContents) {
      if (
        arrItem.hasOwnProperty('@type') &&
        (arrItem['@type'] === 'Recipe' || arrItem['@type'] === 'recipe')
      ) {
        objToReturn = arrItem;
        break;
      }
    }
  } else {
    objToReturn = scriptContents;
  }

  if (objToReturn['@type'] !== 'Recipe' && objToReturn['@type'] !== 'recipe')
    throw new Error(
      `The metadata on the page linked by this URL is not of type Recipe, but of type ${objToReturn['@type']}`,
    );

  return objToReturn;
};

export async function hydrateRecipeAsHook(recipe: Recipe) {
  let dom;
  try {
    const { data } = await axios.get(recipe.url);
    dom = new JSDOM(data);

    if (
      dom.window.document.querySelector("script[type='application/ld+json']")
    ) {
      const scriptContents = JSON.parse(
        dom.window.document.querySelector("script[type='application/ld+json']")
          .text,
      );

      const recipeData = getRecipeDataObjectFromScriptContents(scriptContents);

      recipe.name = recipeData.name.trim();
      recipe.ingredients = parseRecipeIngredients(recipeData.recipeIngredient);
      recipe.steps = parseRecipeSteps(recipeData.recipeInstructions);
      recipe.imageUrl = parseImageUrl(recipeData.image);
    } else {
      throw new Error(
        'The page linked by this URL does not contain embedded metadata',
      );
    }
  } catch (e) {
    throw new InternalServerErrorException(e.message);
  }
}
