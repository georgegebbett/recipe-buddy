import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import { Recipe } from '../schemas/recipe.schema';

@Injectable()
export class RecipeScraper {
  parseRecipeSteps(steps) {
    return steps.flat().map((step) => {
      if (typeof step === 'string') return step.trim();
      if (step.hasOwnProperty('text')) return step.text.trim();
      throw new Error('Unable to parse recipe steps');
    });
  }

  parseImageUrl(image) {
    if (Array.isArray(image)) image = image[0];
    if (typeof image === 'string') return image;
    if (image.hasOwnProperty('url')) return image.url;
    return undefined;
  }

  parseRecipeIngredients = (ingredients) => {
    return ingredients.flat().map((ingredient) => ingredient.trim());
  };

  parseRecipeName = (name) => {
    return name.trim();
  };

  async getNodeListOfMetadataNodesFromUrl(url: string) {
    const dom = await JSDOM.fromURL(url);
    const nodeList: NodeList = dom.window.document.querySelectorAll(
      "script[type='application/ld+json']",
    );

    if (nodeList.length === 0)
      throw new Error('The linked page contains no metadata');

    return nodeList;
  }

  getSchemaRecipeFromNodeList(nodeList: NodeList) {
    for (const node of nodeList.values()) {
      let parsedNodeContent;

      try {
        parsedNodeContent = JSON.parse(node.textContent);
      } catch (e) {
        continue;
      }

      if (Array.isArray(parsedNodeContent)) {
        for (const metadataObject of parsedNodeContent) {
          if (this.jsonObjectIsRecipe(metadataObject)) {
            return metadataObject;
          }
        }
      } else {
        if (this.jsonObjectIsRecipe(parsedNodeContent)) {
          return parsedNodeContent;
        }
        if (this.jsonObjectHasGraph(parsedNodeContent)) {
          for (const graphNode of parsedNodeContent['@graph']) {
            if (this.jsonObjectIsRecipe(graphNode)) {
              return graphNode;
            }
          }
        }
      }
    }
    throw new Error('Unable to extract Recipe metadata from provided url');
  }

  jsonObjectIsRecipe(jsonObject: object): boolean {
    return (
      jsonObject.hasOwnProperty('@type') && /recipe/i.test(jsonObject['@type'])
    );
  }

  jsonObjectHasGraph(jsonObject: object): boolean {
    return jsonObject.hasOwnProperty('@graph');
  }

  async hydrateRecipe(url: string) {
    try {
      const nodeList: NodeList = await this.getNodeListOfMetadataNodesFromUrl(
        url,
      );

      const recipeData = this.getSchemaRecipeFromNodeList(nodeList);

      const recipe = new Recipe();

      recipe.name = this.parseRecipeName(recipeData.name);
      recipe.url = url;
      recipe.ingredients = this.parseRecipeIngredients(
        recipeData.recipeIngredient,
      );
      recipe.steps = this.parseRecipeSteps(recipeData.recipeInstructions);
      recipe.imageUrl = this.parseImageUrl(recipeData.image);
      return recipe;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(e.message);
    }
  }
}
