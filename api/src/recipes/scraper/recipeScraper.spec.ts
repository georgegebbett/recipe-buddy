import { RecipeScraper } from './recipeScraper';
import { Test, TestingModule } from '@nestjs/testing';
import {
  allRecipesDomString,
  allRecipesMetadataObject,
  allRecipesRecipe,
  allRecipesUrl,
  belliniMetadataObject,
  belliniUrl,
  mockNodeList,
  mockRecipe,
  yoastDomString,
  yoastMetadataObject,
  yoastRecipe,
  yoastUrl,
} from './recipeScraperTestConstants';

describe('RecipeScraper', () => {
  let scraper: RecipeScraper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipeScraper],
    }).compile();
    scraper = module.get<RecipeScraper>(RecipeScraper);
  });

  it('should be defined', function () {
    expect(scraper).toBeDefined();
  });

  it('should get a NodeList from a given URL', async function () {
    jest
      .spyOn(scraper, 'getNodeListOfMetadataNodesFromUrl')
      .mockResolvedValueOnce(mockNodeList());
    const foundNodeList = await scraper.getNodeListOfMetadataNodesFromUrl(
      belliniUrl,
    );
    await expect(foundNodeList).toEqual(mockNodeList());
  });

  it('should extract the Recipe object from a NodeList', function () {
    expect(scraper.getSchemaRecipeFromNodeList(mockNodeList())).toEqual(
      belliniMetadataObject,
    );
  });

  it('should extract the Recipe object from a NodeList when the metadata is an array of objects', function () {
    expect(
      scraper.getSchemaRecipeFromNodeList(mockNodeList(allRecipesDomString)),
    ).toEqual(allRecipesMetadataObject);
  });

  it('should extract a Recipe object from a NodeList where the metadata is a graph', function () {
    expect(
      scraper.getSchemaRecipeFromNodeList(mockNodeList(yoastDomString)),
    ).toEqual(yoastMetadataObject);
  });

  it('should correctly parse a recipe name', function () {
    expect(scraper.parseRecipeName(belliniMetadataObject.name)).toEqual(
      'Bellini',
    );
  });

  it('should correctly parse recipe steps', function () {
    expect(
      scraper.parseRecipeSteps(belliniMetadataObject.recipeInstructions),
    ).toEqual([
      'Put the peach puree in a Champagne flute up to about 1/3 full and slowly top up with Prosecco.',
    ]);
  });

  it('should correctly extract the recipe image url', function () {
    expect(scraper.parseImageUrl(belliniMetadataObject.image)).toEqual(
      belliniMetadataObject.image.url,
    );
  });

  it('should correctly parse recipe ingredients', function () {
    const parsedIngredients = scraper.parseRecipeIngredients(
      belliniMetadataObject.recipeIngredient,
    );

    expect(parsedIngredients).toEqual([
      '500ml peach purée or peach nectar',
      '1 bottle prosecco',
    ]);
  });

  it('should be able to return a recipe object from a url where the page metadata contains a single recipe object', async function () {
    jest
      .spyOn(scraper, 'getNodeListOfMetadataNodesFromUrl')
      .mockResolvedValueOnce(mockNodeList());

    await expect(scraper.hydrateRecipe(belliniUrl)).resolves.toEqual(
      mockRecipe(),
    );
  });

  it('should be able to return a recipe object from a url where the page metadata contains an array of objects and one is a Recipe', async function () {
    jest
      .spyOn(scraper, 'getNodeListOfMetadataNodesFromUrl')
      .mockResolvedValueOnce(mockNodeList(allRecipesDomString));

    await expect(scraper.hydrateRecipe(allRecipesUrl)).resolves.toEqual(
      allRecipesRecipe,
    );
  });

  it('should be able to return a recipe object from a url where the page metadata contains a graph containing a recipe object', async function () {
    jest
      .spyOn(scraper, 'getNodeListOfMetadataNodesFromUrl')
      .mockResolvedValueOnce(mockNodeList(yoastDomString));

    await expect(scraper.hydrateRecipe(yoastUrl)).resolves.toEqual(yoastRecipe);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
