import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipe, RecipeSchema } from './schemas/recipe.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Recipe.name, schema: RecipeSchema}])
  ],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [
    MongooseModule.forFeature([{name: Recipe.name, schema: RecipeSchema}]),
    RecipesService
  ]
})
export class RecipesModule {}
