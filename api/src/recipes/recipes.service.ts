import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from './schemas/recipe.schema';
import { hydrateRecipe } from './scraper/recipeScraper';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
  ) {}

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const recipe = await hydrateRecipe(createRecipeDto.url);
    return new this.recipeModel(recipe).save();
  }

  findAll() {
    return this.recipeModel.find().exec();
  }

  findOne(id: string) {
    return this.recipeModel.findOne({ _id: id }).exec();
  }

  async remove(id: string): Promise<Recipe> {
    return this.recipeModel.findByIdAndDelete(id);
  }
}
