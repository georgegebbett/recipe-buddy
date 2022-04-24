import { Body, Controller, Post } from '@nestjs/common';
import { GrocyService } from './grocy.service';
import { AddRecipeToGrocyDto } from './dto/add-recipe-to-grocy.dto';

@Controller('grocy')
export class GrocyController {
  constructor(private readonly grocyService: GrocyService) {}

  @Post('/addRecipe')
  addRecipeToGrocy(@Body() addRecipeToGrocyDto: AddRecipeToGrocyDto) {
    return this.grocyService.addRecipeToGrocy(addRecipeToGrocyDto);
  }

}
