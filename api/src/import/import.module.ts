import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { ImportController } from './import.controller';
import { RecipesService } from '../recipes/recipes.service';
import { RecipesModule } from '../recipes/recipes.module';

@Module({
  imports: [RecipesModule],
  controllers: [ImportController],
  providers: [ImportService, RecipesService],
})
export class ImportModule {}
