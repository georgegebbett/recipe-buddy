import { Recipe } from './schemas/recipe.schema';

const axios = require('axios');
const jsdom = require('jsdom');

const {JSDOM} = jsdom;

const parseRecipeSteps = (steps) => {
  return steps.map((step) => {
    if (typeof step === 'string') return step.trim();
    if (step.hasOwnProperty('text')) return step.text.trim();
    throw new Error('Unable to parse recipe steps');
  })
}

const parseImageUrl = (image) => {
  if (Array.isArray(image)) image = image[0];
  if (typeof image === 'string') return image;
  if (image.hasOwnProperty('url')) return image.url;
  return undefined;
}

const parseRecipeIngredients = (ingredients) => {
  return ingredients.map((ingredient) => ingredient.trim());
}

const getRecipeDataObjectFromScriptContents = (scriptContents) => {

  let objToReturn;

  if (Array.isArray(scriptContents)) {
    for (const arrItem of scriptContents) {
      if (arrItem.hasOwnProperty('@type') && (arrItem['@type'] === 'Recipe' || arrItem['@type'] === 'recipe')) {
        objToReturn = arrItem;
        break;
      }
    }
  } else {
    objToReturn = scriptContents;
  }

  if (objToReturn['@type'] !== "Recipe" && objToReturn['@type'] !== "recipe") throw new Error("This is not a recipe");

  return objToReturn;
}

export async function hydrateRecipe (url: string) {

  const hydratedRecipe = new Recipe();
  hydratedRecipe.url = url;

  console.log(url);

  let dom;
  try {
    const {data} = await axios.get(url);
    dom = new JSDOM(data);

    if (dom.window.document.querySelector("script[type='application/ld+json']")) {
      const scriptContents = JSON.parse((dom.window.document.querySelector("script[type='application/ld+json']")).text);

      const recipeData = getRecipeDataObjectFromScriptContents(scriptContents);

      hydratedRecipe.name = recipeData.name.trim();
      hydratedRecipe.ingredients = parseRecipeIngredients(recipeData.recipeIngredient);
      hydratedRecipe.steps = parseRecipeSteps(recipeData.recipeInstructions);
      hydratedRecipe.imageUrl = parseImageUrl(recipeData.image);

      // console.log(name);
      // console.log(ingredients);
      // console.log(steps);
      // console.log(imageUrl);


    } else {
      throw new Error("Data object not found on page");
    }
  } catch (e) {
    throw e;
  }

  return hydratedRecipe;
}
