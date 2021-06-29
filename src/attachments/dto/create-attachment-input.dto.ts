import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ContentTypeEnum, FileExtensionEnum } from '../enums/attachment.enum';

export class CreateAttachmentInput {
  @IsEnum(ContentTypeEnum)
  readonly contentType: ContentTypeEnum;

  @IsEnum(FileExtensionEnum)
  readonly ext: FileExtensionEnum;

  @IsString()
  @IsNotEmpty()
  readonly filename: string;

  readonly uuid: string;
}