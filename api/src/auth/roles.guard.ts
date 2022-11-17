import { Role } from '../users/role.enum';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ROLES_KEY } from './decorators';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';
import jwtDecode from 'jwt-decode';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { body, headers } = context.switchToHttp().getRequest();
    // this.logger.log('body', body);
    let username = '';
    if (headers.authorization) {
      // @ts-ignore
      username = jwtDecode(headers.authorization).username;
    } else {
      username = body.username;
    }
    const userObj = await this.usersService.findOneByUsername(username);
    if (userObj) {
      return requiredRoles.some((role) => userObj.roles?.includes(role));
    } else {
      return false;
    }
  }
}
