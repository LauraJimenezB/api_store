import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '../common/common.module';
import attachmentConfig from './config/attachments.config';
import { AttachmentsService } from './services/attachments.service';

@Module({
  imports: [ConfigModule.forFeature(attachmentConfig), CommonModule],
  providers: [AttachmentsService],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}
