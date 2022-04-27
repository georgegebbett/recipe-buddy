import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { RecipesModule } from './recipes.module';

describe('RecipesController', () => {
  let recipesController: RecipesController;
  let recipesService: RecipesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [RecipesService, RecipesModule],
    }).compile();

    recipesController = module.get<RecipesController>(RecipesController);
    // recipesService = module.get<RecipesService>(RecipesService);
  });

  it('should be defined', () => {
    expect(recipesController).toBeDefined();
  });
});
