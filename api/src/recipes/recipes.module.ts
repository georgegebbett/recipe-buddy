import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipe, RecipeSchema } from './schemas/recipe.schema';
import { hydrateRecipeAsHook } from './hooks/recipe.hooks';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Recipe.name,
        useFactory: () => {
          const schema = RecipeSchema;
          schema.pre<Recipe>('save', async function () {
            const recipe = this;
            await hydrateRecipeAsHook(recipe);
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [
    RecipesService,
    MongooseModule.forFeatureAsync([
      {
        name: Recipe.name,
        useFactory: () => {
          const schema = RecipeSchema;
          schema.pre<Recipe>('save', async function () {
            const recipe = this;
            await hydrateRecipeAsHook(recipe);
          });
          return schema;
        },
      },
    ]),
  ],
})
export class RecipesModule {}
