import { Module } from '@nestjs/common';

import { PrismaService } from '../common/services/prisma.service';
import { AuthModule } from '../auth/auth.module';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { AttachmentsModule } from '../attachments/attachments.module';

@Module({
  imports: [AuthModule, AttachmentsModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  exports: [ProductsService],
})
export class ProductsModule {}
