import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

const recipeModel = {
  findOne: jest.fn().mockImplementation((id: string) =>
    Promise.resolve({
      _id: id,
    }),
  ),
};

describe('RecipesController', () => {
  let recipesController: RecipesController;
  let recipesService: RecipesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [{ provide: RecipesService, useValue: recipeModel }],
      imports: [],
    }).compile();

    recipesController = module.get<RecipesController>(RecipesController);
    recipesService = module.get<RecipesService>(RecipesService);
  });

  it('should be defined', () => {
    expect(recipesController).toBeDefined();
  });

  describe('getById', () => {
    it('should return a single recipe', async () => {
      await expect(recipesController.findOne('1')).resolves.toEqual({
        _id: '1',
      });
      await expect(recipesController.findOne('2')).resolves.toEqual({
        _id: '2',
      });
    });
  });
});
