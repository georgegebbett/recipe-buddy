import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { uid } from 'rand-token';
import { refreshTokenSize } from './constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  generateRefreshToken(): string {
    return uid(refreshTokenSize);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user1: any) {
    const user = user1._doc;
    const payload = { username: user.username, sub: user._id };
    const refreshToken = this.generateRefreshToken();
    await this.usersService.setRefreshTokenByUsername(
      user.username,
      refreshToken,
    );
    return {
      username: user.username,
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
      roles: user.roles,
    };
  }

  async logout(username: string) {
    await this.usersService.invalidateRefreshTokenByUsername(username);
  }

  async refreshToken(refresh_token: string, username: string) {
    const user = await this.usersService.findOneByUsername(username);
    this.logger.log(user);
    if (refresh_token === user.refresh_token) {
      const newRefreshToken = this.generateRefreshToken();
      await this.usersService.setRefreshTokenByUsername(
        username,
        newRefreshToken,
      );
      const payload = { username: user.username };
      return {
        username: user.username,
        access_token: this.jwtService.sign(payload),
        refresh_token: newRefreshToken,
      };
    } else {
      throw new UnauthorizedException('Refresh token incorrect');
    }
  }
}
