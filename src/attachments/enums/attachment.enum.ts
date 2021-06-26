export enum FileExtensionEnum {
  PNG = 'png',
  JPG = 'jpg',
  JPEG = 'jpeg',
}

export enum ContentTypeEnum {
  'PNG' = 'image/png',
  'JPG' = 'image/jpg',
  'JPEG' = 'image/jpeg',
}

export enum ParentEnum {
  USER = 'USER',
}

export enum AttachmentDirectoryEnum {
  USER = 'attachments/users/{uuid}/avatars',
}

export type FileExtensionType = keyof typeof FileExtensionEnum;
export type ContentTypeType = keyof typeof ContentTypeEnum;

/* registerEnumType(FileExtensionEnum, {
  name: 'FileExtensionEnum',
  description: 'The supported file extensions',
});

registerEnumType(ContentTypeEnum, {
  name: 'ContentTypeEnum',
  description: 'The supported content types',
});
 */
