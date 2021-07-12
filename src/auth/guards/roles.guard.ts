import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import jwt_decode from 'jwt-decode';
import { RolesEnum, RolesNameEnum } from 'src/auth/enums/roles.enum';
import { UsersService } from 'src/users/users.service';
import { DecodedDto } from '../../users/dto/decoded.dto';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: string[] = this._reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const decoded: DecodedDto = jwt_decode(request.header('Authorization'));

    const userRolesIds = await this.usersService.getUserRoles(decoded.sub);
    const rolesU = userRolesIds.map((roleId) => {
      if (roleId === RolesEnum.CLIENT) {
        return RolesNameEnum.CLIENT.toString();
      }
      if (roleId === RolesEnum.MANAGER) {
        return RolesNameEnum.MANAGER.toString();
      }
    });
    const hasRole = () => rolesU.some((role: string) => roles.includes(role));
    return decoded && rolesU && hasRole();
  }
}
