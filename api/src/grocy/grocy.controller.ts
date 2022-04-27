import { Body, Controller, Post, Request } from '@nestjs/common';
import { GrocyService } from './grocy.service';
import { AddRecipeToGrocyDto } from './dto/add-recipe-to-grocy.dto';

interface RequestWithUserInfo extends Request {
  user: {
    userId: string;
    username: string;
  };
}

@Controller('grocy')
export class GrocyController {
  constructor(private readonly grocyService: GrocyService) {}

  @Post('/addRecipe')
  addRecipeToGrocy(
    @Body() addRecipeToGrocyDto: AddRecipeToGrocyDto,
    @Request() req: RequestWithUserInfo,
  ) {
    return this.grocyService.addRecipeToGrocy(addRecipeToGrocyDto, req);
  }
}
