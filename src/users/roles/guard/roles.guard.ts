import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import jwt_decode from 'jwt-decode';
import { DecodedDto } from '../../dto/decoded.dto';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  async validate(payload: any): Promise<any> {
    return {
      id: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }

  canActivate(context: ExecutionContext): boolean {
    const roles: string[] = this._reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const decoded: DecodedDto = jwt_decode(request.header('Authorization'));

    const hasRole = () =>
      decoded.roles.some((role: string) => roles.includes(role));

    return decoded && decoded.roles && hasRole();
  }
}
