import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipe, RecipeSchema } from './schemas/recipe.schema';
import { RecipeScraper } from './scraper/recipeScraper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
  ],
  controllers: [RecipesController],
  providers: [RecipesService, RecipeScraper],
  exports: [
    RecipesService,
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
    RecipeScraper,
  ],
})
export class RecipesModule {}
