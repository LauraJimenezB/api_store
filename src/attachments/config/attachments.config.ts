import { registerAs } from '@nestjs/config';

export default registerAs('attachment', () => ({
  accessKeyId: 'AKIAXA4D74BJNUZWNHIZ',
  secretAccessKey: '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',
  region: process.env.AWS_REGION,
  bucket: process.env.AWS_BUCKET,
  expirationTime: +process.env.PRESIGNED_EXPIRES_IN,
}));