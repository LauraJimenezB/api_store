import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { PrismaService } from '../common/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
//import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: configService.get<string>('JWT_EXP') },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    CreateUserDto,
    PrismaService,
    //{ provide: APP_GUARD, useClass: JwtStrategy },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
