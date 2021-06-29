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
  private readonly preSignedPutURL;
  private readonly preSignedGetURL;

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

    this.preSignedPutURL = (): {
      key: string;
      url: string;
    } => {
      const key = nanoid();
      const url = this.s3.getSignedUrl('putObject', {
        Bucket: configService.bucket,
        Key: key,
        Expires: configService.expirationTime,
        ContentType: 'image/jpeg',
      });
      return { key, url };
    };

    this.preSignedGetURL = (key: string): string => {
      const params = {
        Bucket: configService.bucket,
        Key: key,
        Expires: configService.expirationTime,
      };
      return this.s3.getSignedUrl('getObject', params);
    };
  }

  async uploadImages(
    bookId: number,
    type,
    input: CreateAttachmentDto,
  ): Promise<AttachmentDto> {
    const path = AttachmentDirectoryEnum[input.parentType].replace(
      '{uuid}',
      input.uuid,
    );
    let extension;
    if(type==='image/png') {
      extension = 'png'
    } else if (type==='image/jpg') {
      extension = 'jpg'
    } else {
      extension = 'jpeg'
    }
    const attachment = await this.prismaService.attachment.create({
      data: {
        contentType: type,
        key: `${nanoid()}`,
        ext: extension,
        path,
        bookId,
      },
    });
    const signedUrl = this.s3.getSignedUrl('putObject', {
      Key: `${path}/${attachment.key}.${attachment.ext}`,
      ContentType: attachment.contentType,
      Bucket: this.configService.bucket,
      Expires: this.configService.expirationTime,
    });
    return plainToClass(AttachmentDto, { signedUrl, ...attachment });
  } 

  async getImages(bookId: number): Promise<AttachmentDto[]> {
    const attachments = await this.prismaService.attachment.findMany({
      where: { bookId },
    });
    const signedUrl = attachments.map((attachment) =>
      plainToClass(AttachmentDto, this.preSignedGetURL(attachment.key)),
    );

    return signedUrl;
    /* return attachments.map((attachment) => {
      return this.attachmentMapper.toDto(
        attachment,
        s3.preSignedGetURL(attachment.key),
      );
    }); */
  }
}
