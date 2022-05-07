import { Recipe as SchemaRecipe } from 'schema-dts';
import { InternalServerErrorException } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import { CreateRecipeDto } from '../dto/create-recipe.dto';

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

const parseRecipeName = (name) => {
  return name.trim();
};

const getNodeListOfMetadataNodesFromUrl: (
  url: string,
) => Promise<NodeList> = async (url: string) => {
  const dom = await JSDOM.fromURL(url);
  const nodeList: NodeList = dom.window.document.querySelectorAll(
    "script[type='application/ld+json']",
  );

  if (nodeList.length === 0)
    throw new Error('The linked page contains no metadata');

  return nodeList;
};

const getSchemaRecipeFromNodeList: (nodeList: NodeList) => SchemaRecipe = (
  nodeList: NodeList,
) => {
  for (const node of nodeList.values()) {
    let parsedNodeContent;

    try {
      parsedNodeContent = JSON.parse(node.textContent);
    } catch (e) {
      continue;
    }

    if (Array.isArray(parsedNodeContent)) {
      for (const metadataObject of parsedNodeContent) {
        if (
          metadataObject.hasOwnProperty('@type') &&
          /recipe/i.test(metadataObject['@type'])
        ) {
          return metadataObject;
        }
      }
    } else {
      if (
        parsedNodeContent.hasOwnProperty('@type') &&
        /recipe/i.test(parsedNodeContent['@type'])
      ) {
        return parsedNodeContent;
      }
    }
  }
  throw new Error('Unable to extract Recipe metadata from provided url');
};

export async function hydrateRecipe(url: string) {
  try {
    const nodeList: NodeList = await getNodeListOfMetadataNodesFromUrl(url);

    const recipeData = getSchemaRecipeFromNodeList(nodeList);

    const recipe = new CreateRecipeDto();

    recipe.name = parseRecipeName(recipeData.name);
    recipe.url = url;
    recipe.ingredients = parseRecipeIngredients(recipeData.recipeIngredient);
    recipe.steps = parseRecipeSteps(recipeData.recipeInstructions);
    recipe.imageUrl = parseImageUrl(recipeData.image);
    return recipe;
  } catch (e) {
    console.error(e);
    throw new InternalServerErrorException(e.message);
  }
}
