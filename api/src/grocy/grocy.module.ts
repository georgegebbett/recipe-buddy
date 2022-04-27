import { Module } from '@nestjs/common';
import { GrocyService } from './grocy.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { GrocyController } from './grocy.controller';

@Module({
  controllers: [GrocyController],
  providers: [GrocyService, UsersService],
  imports: [UsersModule],
})
export class GrocyModule {}
