import { Controller, Delete, Post, Request, UseGuards } from '@nestjs/common';
import { Public, Roles } from './decorators';
import { LocalAuthGuard } from './local-auth.guard';
import { Role } from '../users/role.enum';
import jwtDecode from 'jwt-decode';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Delete('/login')
  async logout(@Request() req) {
    return this.authService.logout(req.body.username);
  }

  @Roles(Role.User)
  @Post('/token')
  async token(@Request() req) {
    const { body, headers } = req;
    // @ts-ignore
    const username = jwtDecode(headers.authorization).username;
    return this.authService.refreshToken(body.refresh_token, username);
  }
}
