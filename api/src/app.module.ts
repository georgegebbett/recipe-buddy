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

const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT;
const mongoConnectionString = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/`;

console.log(`Using database at "${mongoHost}:${mongoPort}" with user "${mongoUser}"`);

@Module({
  imports: [
    MongooseModule.forRoot(mongoConnectionString),
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
