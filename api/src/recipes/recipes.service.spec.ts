import { Test, TestingModule } from '@nestjs/testing';
import { RecipesService } from './recipes.service';
import { Recipe, RecipeDocument } from './schemas/recipe.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecipeScraper } from './scraper/recipeScraper';

const mockRecipe = (
  url = 'https://www.bbcgoodfood.com/recipes/bellini',
  name = 'Bellini',
  imageUrl = 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/bellini-b049342.jpg?quality=90&webp=true&resize=300,272',
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

const mockRecipeDoc = (mock?: Partial<Recipe>): Partial<RecipeDocument> => ({
  url: mock?.url || 'https://www.bbcgoodfood.com/recipes/bellini',
  name: mock?.name || 'Bellini',
  imageUrl:
    mock?.imageUrl ||
    'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/bellini-b049342.jpg?quality=90&webp=true&resize=300,272',
  ingredients: mock?.ingredients || [
    '500ml peach purée or peach nectar',
    '1 bottle prosecco',
  ],
  steps: mock?.steps || [
    'Put the peach puree in a Champagne flute up to about 1/3 full and slowly top up with Prosecco.',
  ],
});

const recipeArray = [mockRecipe()];

const recipeDocArray = [mockRecipeDoc()];

describe('RecipesService', () => {
  let service: RecipesService;
  let model: Model<RecipeDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        RecipeScraper,
        {
          provide: getModelToken('Recipe'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockRecipe()),
            constructor: jest.fn().mockResolvedValue(mockRecipe()),
            find: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
    model = module.get<Model<RecipeDocument>>(getModelToken('Recipe'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all recipes', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(recipeDocArray),
    } as any);
    const recipes = await service.findAll();
    expect(recipes).toEqual(recipeArray);
  });
});
