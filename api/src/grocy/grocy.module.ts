import { Module } from '@nestjs/common';
import { GrocyService } from './grocy.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { GrocyController } from './grocy.controller';
import { RecipesModule } from '../recipes/recipes.module';
import { RecipesService } from '../recipes/recipes.service';

@Module({
  controllers: [GrocyController],
  providers: [GrocyService, UsersService, RecipesService],
  imports: [UsersModule, RecipesModule],
})
export class GrocyModule {}
