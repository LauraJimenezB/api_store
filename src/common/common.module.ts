import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { PrismaService } from './services/prisma.service';

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [PrismaService, { provide: APP_GUARD, useClass: JwtStrategy }],
})
export class CommonModule {}
