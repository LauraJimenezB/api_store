import { Attachment } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { ContentTypeEnum, FileExtensionEnum } from '../enums/attachment.enum';

@Exclude()
export class AttachmentDto implements Attachment {
  @Expose()
  readonly id: number;
  readonly uuid: string;
  readonly path: string;
  readonly key: string;

  @Expose()
  readonly ext: FileExtensionEnum;

  @Expose()
  readonly contentType: ContentTypeEnum;

  @Expose()
  readonly filename: string;

  @Expose()
  readonly signedUrl?: string;

  @Expose()
  readonly createdAt: Date;

  readonly bookId: number;
}
