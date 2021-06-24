import { Module } from '@nestjs/common';

import { PrismaService } from '../common/services/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  exports: [ProductsService],
})
export class ProductsModule {}
