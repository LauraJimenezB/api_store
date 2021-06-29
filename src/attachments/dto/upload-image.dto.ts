import { IsNotEmpty, IsString } from 'class-validator';
import { ContentTypeEnum, FileExtensionEnum } from '../enums/attachment.enum';
export class UploadImageDto {
  @IsString()
  @IsNotEmpty()
  readonly contentType: ContentTypeEnum;
  @IsString()
  @IsNotEmpty()
  readonly ext: FileExtensionEnum;
  @IsString()
  @IsNotEmpty()
  readonly filename: string;
}
