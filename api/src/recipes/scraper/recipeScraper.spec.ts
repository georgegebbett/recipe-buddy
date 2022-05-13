import { RecipeScraper } from './recipeScraper';
import { Test, TestingModule } from '@nestjs/testing';
import { JSDOM } from 'jsdom';
import { Recipe } from '../schemas/recipe.schema';

describe('RecipeScraper', () => {
  let scraper: RecipeScraper;

  let testVar;

  const belliniUrl = 'https://www.bbcgoodfood.com/recipes/bellini';

  const mockNodeList = (
    domString = '<script type="application/ld+json">{"@context":"https://schema.org","@id":"https://www.bbcgoodfood.com/recipes/bellini#Recipe","@type":"Recipe","description":"A classy cocktail served in an elegant flute - this simple combination of peach purée and Prosecco makes a great start to any celebration","image":{"@type":"ImageObject","height":400,"url":"https://images.immediate.co.uk/production/volatile/sites/30/2020/08/bellini-b049342.jpg","width":440},"mainEntityOfPage":{"@type":"WebPage","@id":"https://www.bbcgoodfood.com/recipes/bellini"},"name":"Bellini","url":"https://www.bbcgoodfood.com/recipes/bellini","author":{"@type":"Person","name":"Good Food team"},"dateModified":"2020-08-08T02:26:26+00:00","datePublished":"2013-11-18T16:37:44+00:00","headline":"Bellini","keywords":"Christmas, Christmas morning, cocktails canapes, Good Food, Party, sparkling cocktail","publisher":{"@type":"Organization","name":"BBC Good Food","url":"https://www.bbcgoodfood.com","logo":{"@type":"ImageObject","url":"https://images.immediate.co.uk/production/volatile/sites/30/2019/07/GoodFood-dark-516d417.png","width":221,"height":58}},"nutrition":{"@type":"NutritionInformation","calories":"143 calories","carbohydrateContent":"18 grams carbohydrates","sugarContent":"18 grams sugar","fiberContent":"0.7 grams fiber","proteinContent":"0.7 grams protein"},"prepTime":"PT5M","recipeCategory":"Cocktails","recipeIngredient":["500ml peach purée or peach nectar","1 bottle prosecco"],"recipeInstructions":[{"@type":"HowToStep","text":"Put the peach puree in a Champagne flute up to about 1/3 full and slowly top up with Prosecco."}],"recipeYield":6,"totalTime":"PT5M"}</script><script type="application/ld+json">{"@context":"https://schema.org/","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://www.bbcgoodfood.com/"},{"@type":"ListItem","position":2,"name":"Recipes","item":"https://www.bbcgoodfood.com/recipes"},{"@type":"ListItem","position":3,"name":"Bellini"}]}</script>{"@context":"https://schema.org/","@id":"https://www.bbcgoodfood.com/recipes/bellini#Recipe","aggregateRating":{"@type":"AggregateRating","ratingValue":4,"reviewCount":2,"bestRating":5,"worstRating":1}}',
  ) => {
    return JSDOM.fragment(domString).querySelectorAll(
      "script[type='application/ld+json']",
    );
  };

  const belliniMetadataObject = {
    '@context': 'https://schema.org',
    '@id': 'https://www.bbcgoodfood.com/recipes/bellini#Recipe',
    '@type': 'Recipe',
    description:
      'A classy cocktail served in an elegant flute - this simple combination of peach purée and Prosecco makes a great start to any celebration',
    image: {
      '@type': 'ImageObject',
      height: 400,
      url: 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/bellini-b049342.jpg',
      width: 440,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.bbcgoodfood.com/recipes/bellini',
    },
    name: 'Bellini',
    url: 'https://www.bbcgoodfood.com/recipes/bellini',
    author: { '@type': 'Person', name: 'Good Food team' },
    dateModified: '2020-08-08T02:26:26+00:00',
    datePublished: '2013-11-18T16:37:44+00:00',
    headline: 'Bellini',
    keywords:
      'Christmas, Christmas morning, cocktails canapes, Good Food, Party, sparkling cocktail',
    publisher: {
      '@type': 'Organization',
      name: 'BBC Good Food',
      url: 'https://www.bbcgoodfood.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://images.immediate.co.uk/production/volatile/sites/30/2019/07/GoodFood-dark-516d417.png',
        width: 221,
        height: 58,
      },
    },
    nutrition: {
      '@type': 'NutritionInformation',
      calories: '143 calories',
      carbohydrateContent: '18 grams carbohydrates',
      sugarContent: '18 grams sugar',
      fiberContent: '0.7 grams fiber',
      proteinContent: '0.7 grams protein',
    },
    prepTime: 'PT5M',
    recipeCategory: 'Cocktails',
    recipeIngredient: [
      '500ml peach purée or peach nectar',
      '1 bottle prosecco',
    ],
    recipeInstructions: [
      {
        '@type': 'HowToStep',
        text: 'Put the peach puree in a Champagne flute up to about 1/3 full and slowly top up with Prosecco.',
      },
    ],
    recipeYield: 6,
    totalTime: 'PT5M',
  };

  const mockRecipe = (
    url = 'https://www.bbcgoodfood.com/recipes/bellini',
    name = 'Bellini',
    imageUrl = 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/bellini-b049342.jpg',
    ingredients = ['500ml peach purée or peach nectar', '1 bottle prosecco'],
    steps = [
      'Put the peach puree in a Champagne flute up to about 1/3 full and slowly top up with Prosecco.',
    ],
  ): Recipe => ({
    url,
    name,
    imageUrl,
    ingredients,
    steps,
  });

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
    expect(foundNodeList).toEqual(mockNodeList());
  });

  it('should extract the Recipe object from a NodeList', function () {
    expect(scraper.getSchemaRecipeFromNodeList(mockNodeList())).toEqual(
      belliniMetadataObject,
    );
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

  it('should be able to return a recipe object from a url', async function () {
    jest
      .spyOn(scraper, 'getNodeListOfMetadataNodesFromUrl')
      .mockResolvedValueOnce(mockNodeList());

    expect(await scraper.hydrateRecipe(belliniUrl)).toEqual(mockRecipe());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
