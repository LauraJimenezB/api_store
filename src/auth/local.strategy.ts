/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
      super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if(!user) {
      throw new UnauthorizedException();
    }

    return user;
  } 

  /* async validate(username: string, password: string, context: ExecutionContext): Promise<any> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true;
    }
    const user = await this. authService.validateUser(username, password);

    if(!user) {
      throw new UnauthorizedException();
    }

    return user;
  } */
}
