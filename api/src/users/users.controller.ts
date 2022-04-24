import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from './role.enum';
import { Roles } from '../auth/decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @Roles(Role.Admin)
  create(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('roles') roles: string[],
  ) {
    return this.usersService.create({
      username: username,
      password: password,
      roles: roles,
    });
  }
}
