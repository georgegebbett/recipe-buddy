import { Body, Controller, Get, Post, Put, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from './role.enum';
import { Public, Roles } from '../auth/decorators';

interface RequestWithUserInfo extends Request {
  user: {
    userId: string;
    username: string;
    roles: Role[];
  };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/me')
  @Roles(Role.Admin, Role.User)
  findMe(@Request() request: RequestWithUserInfo) {
    return this.usersService.findOneById(request.user.userId);
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

  @Put()
  @Roles(Role.Admin)
  update(
    @Body('grocyBaseUrl') grocyBaseUrl: string,
    @Body('grocyApiKey') grocyApiKey: string,
    @Request() request: RequestWithUserInfo,
  ) {
    return this.usersService.findOneByIdAndUpdate(request.user.userId, {
      grocyBaseUrl: grocyBaseUrl,
      grocyApiKey: grocyApiKey,
    });
  }

  @Get('/setup')
  @Public()
  getIsSetup() {
    return this.usersService.isSetup();
  }

  @Post('/setup')
  @Public()
  setupUser(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.usersService.setup({
      username: username,
      password: password,
      roles: [Role.Admin, Role.User],
    });
  }
}
