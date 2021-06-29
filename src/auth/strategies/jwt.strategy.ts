import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../auth/auth.service';
import { PayloadDto } from '../dto/payload.dto';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JWTPayloadType } from '../types/auth.type';
import { plainToClass } from 'class-transformer';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JWTPayloadType): Promise<PayloadDto> {
    const payloadObj = {
      id: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
    const user = await this.authService.validateAccount(payloadObj.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (!user.active) {
      throw new ForbiddenException('Log in in first');
    }
    return plainToClass(PayloadDto, payloadObj);
  }
}
