import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { RecipesModule } from './recipes/recipes.module';
import { GrocyModule } from './grocy/grocy.module';
import { ImportModule } from './import/import.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:root@mongo:27017/'),
    AuthModule,
    UsersModule,
    RecipesModule,
    GrocyModule,
    ImportModule,
  ],
  providers: [
    AppService,
    UsersService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
