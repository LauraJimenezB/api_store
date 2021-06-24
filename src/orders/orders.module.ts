import { Module } from '@nestjs/common';

import { PrismaService } from '../common/services/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService],
  exports: [OrdersService],
})
export class OrdersModule {}
