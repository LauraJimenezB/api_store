import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PrismaService } from '../../common/services/prisma.service';
import { config as configAWS, S3 } from 'aws-sdk';
import attachmentConfig from '../config/attachments.config';
import { v4 as uuid } from 'uuid';
import { CreateAttachmentDto } from '../dto/create-attachment.dto';
import { AttachmentDto } from '../dto/attachment.dto';
import { AttachmentDirectoryEnum } from '../enums/attachment.enum';
import { plainToClass } from 'class-transformer';
import { nanoid } from 'nanoid';
import { Attachment } from '@prisma/client';

@Injectable()
export class AttachmentsService {
  private readonly s3: S3;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(attachmentConfig.KEY)
    private readonly configService: ConfigType<typeof attachmentConfig>,
  ) {
    configAWS.update({
      credentials: {
        accessKeyId: configService.accessKeyId,
        secretAccessKey: configService.secretAccessKey,
      },
      region: configService.region,
    });
    this.s3 = new S3();
  }

  async uploadImages(dataBuffer: Buffer, bookId: number, filename: string) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.bucket,
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    const newFile = this.prismaService.attachment.create({
      data: {
        key: uploadResult.Key,
        bookId,
      },
    });
    return newFile;
  }
}
